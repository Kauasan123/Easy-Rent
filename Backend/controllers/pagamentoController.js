const { PrismaClient } = require('@prisma/client');
const asaasApi = require('../Services/asaasService');
const { obterOuCriarClienteAsaas } = require('../Services/asaasCustomerService');
const crypto = require('crypto');

const prisma = new PrismaClient();

const calcularDiarias = (inicio, fim) => {
    const dataInicio = new Date(inicio);
    const dataFim = new Date(fim);

    if (
        Number.isNaN(dataInicio.getTime()) ||
        Number.isNaN(dataFim.getTime())
    ) {
        return 0;
    }

    const inicioUTC = Date.UTC(
        dataInicio.getUTCFullYear(),
        dataInicio.getUTCMonth(),
        dataInicio.getUTCDate()
    );

    const fimUTC = Date.UTC(
        dataFim.getUTCFullYear(),
        dataFim.getUTCMonth(),
        dataFim.getUTCDate()
    );

    return Math.round(
        (fimUTC - inicioUTC) / (1000 * 60 * 60 * 24)
    );
};

const criarPagamento = async (req, res) => {
    try {
        const usuarioId = Number(req.usuarioId);
        const { reservaId, metodo, cpf } = req.body;

        const idReserva = Number(reservaId);

        if (!Number.isInteger(idReserva) || idReserva <= 0) {
            return res.status(400).json({
                erro: 'Reserva inválida.'
            });
        }

        if (metodo !== 'Pix') {
            return res.status(400).json({
                erro: 'No momento, somente pagamentos via Pix estão disponíveis.'
            });
        }

        const reserva = await prisma.reserva.findUnique({
            where: {
                id: idReserva
            },
            include: {
                hospede: true,
                imovel: true
            }
        });

        if (!reserva) {
            return res.status(404).json({
                erro: 'Reserva não encontrada.'
            });
        }

        if (reserva.hospedeId !== usuarioId) {
            return res.status(403).json({
                erro: 'Você não tem permissão para pagar esta reserva.'
            });
        }

        if (reserva.status !== 'Pendente') {
            return res.status(400).json({
                erro: 'Esta reserva não está pendente.'
            });
        }

        let pagamentoExistente = await prisma.pagamento.findUnique({
            where: {
                reservaId: idReserva
            }
        });

        if (pagamentoExistente) {
            if (
                pagamentoExistente.status === 'Pendente' &&
                pagamentoExistente.asaasPaymentId
            ) {
                const respostaPix = await asaasApi.get(
                    `/payments/${pagamentoExistente.asaasPaymentId}/pixQrCode`
                );

                const pix = respostaPix.data;

                pagamentoExistente = await prisma.pagamento.update({
                    where: {
                        id: pagamentoExistente.id
                    },
                    data: {
                        pixQrCode: pix.encodedImage,
                        pixCopiaECola: pix.payload,
                        expiraEm: pix.expirationDate
                            ? new Date(pix.expirationDate)
                            : null
                    }
                });

                return res.status(200).json({
                    mensagem: 'Pagamento Pix recuperado.',
                    pagamento: pagamentoExistente
                });
            }

            return res.status(400).json({
                erro: 'Esta reserva já possui um pagamento.'
            });
        }

        const diarias = calcularDiarias(
            reserva.inicio,
            reserva.fim
        );

        if (diarias <= 0) {
            return res.status(400).json({
                erro: 'O período da reserva é inválido.'
            });
        }

        const precoDiaria = Number(reserva.imovel.preco);

        if (!Number.isFinite(precoDiaria) || precoDiaria <= 0) {
            return res.status(400).json({
                erro: 'O preço do imóvel é inválido.'
            });
        }

        const subtotal = Number(
            (precoDiaria * diarias).toFixed(2)
        );

        const taxaServico = Number(
            (subtotal * 0.05).toFixed(2)
        );

        const valorTotal = Number(
            (subtotal + taxaServico).toFixed(2)
        );

        const clienteAsaasId = await obterOuCriarClienteAsaas(
            reserva.hospede,
            cpf
        );

        if (
            reserva.hospede.asaasCustomerId !== clienteAsaasId
        ) {
            await prisma.usuario.update({
                where: {
                    id: usuarioId
                },
                data: {
                    asaasCustomerId: clienteAsaasId
                }
            });
        }

        const vencimento = new Date();
        vencimento.setDate(vencimento.getDate() + 1);

        const dueDate = [
            vencimento.getFullYear(),
            String(vencimento.getMonth() + 1).padStart(2, '0'),
            String(vencimento.getDate()).padStart(2, '0')
        ].join('-');

        const respostaCobranca = await asaasApi.post(
            '/payments',
            {
                customer: clienteAsaasId,
                billingType: 'PIX',
                value: valorTotal,
                dueDate,
                description: `Reserva Easy Rent - ${reserva.imovel.titulo}`,
                externalReference: String(idReserva)
            }
        );

        const cobranca = respostaCobranca.data;

        let pagamento = await prisma.pagamento.create({
            data: {
                valor: valorTotal,
                metodo: 'Pix',
                status: 'Pendente',
                reservaId: idReserva,
                asaasPaymentId: cobranca.id,
                invoiceUrl: cobranca.invoiceUrl || null
            }
        });

        const respostaPix = await asaasApi.get(
            `/payments/${cobranca.id}/pixQrCode`
        );

        const pix = respostaPix.data;

        pagamento = await prisma.pagamento.update({
            where: {
                id: pagamento.id
            },
            data: {
                pixQrCode: pix.encodedImage,
                pixCopiaECola: pix.payload,
                expiraEm: pix.expirationDate
                    ? new Date(pix.expirationDate)
                    : null
            },
            include: {
                reserva: {
                    include: {
                        hospede: {
                            select: {
                                id: true,
                                nome: true,
                                email: true,
                                avatarPath: true
                            }
                        },
                        imovel: {
                            select: {
                                id: true,
                                titulo: true,
                                cidade: true,
                                bairro: true,
                                preco: true,
                                tipoCobranca: true,
                                usuarioId: true
                            }
                        }
                    }
                }
            }
        });

        return res.status(201).json({
            mensagem: 'Cobrança Pix criada com sucesso.',
            pagamento,
            resumo: {
                diarias,
                precoDiaria,
                subtotal,
                taxaServico,
                valorTotal
            }
        });

    } catch (error) {
        console.error('========== ERRO AO CRIAR PAGAMENTO ==========');
        console.error('Mensagem:', error.message);
        console.error('Resposta do Asaas:', error.response?.data);
        console.error('Status HTTP:', error.response?.status);
        console.error('Código:', error.code);
        console.error('Stack:', error.stack);
        console.error('==============================================');

        return res.status(500).json({
            erro: 'Não foi possível criar o pagamento. Tente novamente.'
        });
    }
};

const listarPagamentosPorUsuario = async (req, res) => {
    try {
        const id = Number(req.usuarioId);

        const pagamentos = await prisma.pagamento.findMany({
            where: {
                reserva: {
                    imovel: {
                        usuarioId: id
                    }
                }
            },
            include: {
                reserva: {
                    include: {
                        hospede: {
                            select: {
                                id: true,
                                nome: true,
                                email: true,
                                avatarPath: true
                            }
                        },
                        imovel: {
                            include: {
                                imagens: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                dataPagamento: 'desc'
            }
        });

        return res.json(pagamentos);

    } catch (error) {
        console.error(
            'Erro ao buscar pagamentos do usuário:',
            error
        );

        return res.status(500).json({
            erro: 'Erro ao buscar pagamentos do usuário.'
        });
    }
};

const processarWebhookAsaas = async (req, res) => {
    try {
        const tokenRecebido = req.get('asaas-access-token');
        const tokenEsperado = process.env.ASAAS_WEBHOOK_TOKEN;

        if (!tokenEsperado) {
            console.error('Token do webhook não configurado.');
            return res.status(500).json({
                erro: 'Configuração do webhook ausente.'
            });
        }

        if (
            !tokenRecebido ||
            Buffer.byteLength(tokenRecebido) !== Buffer.byteLength(tokenEsperado) ||
            !crypto.timingSafeEqual(
                Buffer.from(tokenRecebido),
                Buffer.from(tokenEsperado)
            )
        ) {
            return res.status(401).json({
                erro: 'Token de autenticação inválido.'
            });
        }

        const { event, payment } = req.body;

        if (
            !['PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED'].includes(event)
        ) {
            return res.status(200).json({
                mensagem: 'Evento ignorado.'
            });
        }

        if (!payment?.id) {
            return res.status(400).json({
                erro: 'Identificador do pagamento ausente.'
            });
        }

        const pagamento = await prisma.pagamento.findUnique({
            where: {
                asaasPaymentId: payment.id
            },
            include: {
                reserva: true
            }
        });

        if (!pagamento) {
            console.error(
                'Pagamento não encontrado:',
                payment.id
            );

            return res.status(404).json({
                erro: 'Pagamento não encontrado.'
            });
        }

        const dataPagamento =
            payment.confirmedDate ||
            payment.paymentDate ||
            payment.clientPaymentDate ||
            new Date();

        await prisma.$transaction(async (tx) => {
            await tx.pagamento.update({
                where: {
                    id: pagamento.id
                },
                data: {
                    status: 'Confirmado',
                    dataPagamento: new Date(dataPagamento)
                }
            });

            if (pagamento.reserva.status === 'Pendente') {
                await tx.reserva.update({
                    where: {
                        id: pagamento.reservaId
                    },
                    data: {
                        status: 'Confirmada'
                    }
                });
            }
        });

        console.log(
            `Pagamento ${payment.id} confirmado pelo Asaas.`
        );

        return res.status(200).json({
            mensagem: 'Pagamento processado com sucesso.'
        });

    } catch (error) {
        console.error('Erro ao processar webhook Asaas:', error);

        return res.status(500).json({
            erro: 'Erro ao processar notificação do Asaas.'
        });
    }
};

module.exports = {
    criarPagamento,
    listarPagamentosPorUsuario,
    processarWebhookAsaas
};