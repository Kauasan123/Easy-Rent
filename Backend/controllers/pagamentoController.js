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
        const {
            reservaId,
            metodo,
            numeroCartao,
            validade,
            cvv,
            cpf,
            nome,
            sobrenome,
            telefone,
            dataNascimento,
            email,
            cep,
            rua,
            numero,
            bairro
        } = req.body;

        const idReserva = Number(reservaId);

        if (!Number.isInteger(idReserva) || idReserva <= 0) {
            return res.status(400).json({
                erro: 'Reserva inválida.'
            });
        }

        if (!['Cartão de Crédito', 'Pix', 'Boleto'].includes(metodo)) {
            return res.status(400).json({
                erro: 'Método de pagamento inválido.'
            });
        }

        const cpfLimpo = String(cpf || '').replace(/\D/g, '');
        const telefoneLimpo = String(telefone || '').replace(/\D/g, '');

        if (
            !nome?.trim() ||
            !sobrenome?.trim() ||
            cpfLimpo.length !== 11 ||
            telefoneLimpo.length < 10 ||
            telefoneLimpo.length > 11 ||
            !dataNascimento ||
            Number.isNaN(Date.parse(dataNascimento))
        ) {
            return res.status(400).json({
                erro: 'Informe corretamente seus dados pessoais.'
            });
        }

        if (metodo === 'Boleto') {
            const cepLimpo = String(cep || '').replace(/\D/g, '');

            if (
                !email?.trim() ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
                cepLimpo.length !== 8 ||
                !rua?.trim() ||
                !numero?.trim() ||
                !bairro?.trim()
            ) {
                return res.status(400).json({
                    erro: 'Informe corretamente os dados de endereço para o boleto.'
                });
            }
        }

        if (metodo === 'Cartão de Crédito') {
            const numeroCartaoLimpo = String(numeroCartao || '').replace(/\D/g, '');
            const cvvLimpo = String(cvv || '').replace(/\D/g, '');

            if (numeroCartaoLimpo.length !== 16) {
                return res.status(400).json({
                    erro: 'Número de cartão inválido.'
                });
            }

            if (!/^\d{2}\/\d{2}$/.test(validade || '')) {
                return res.status(400).json({
                    erro: 'Validade do cartão inválida.'
                });
            }

            const [mes, ano] = validade.split('/').map(Number);
            const hoje = new Date();

            if (
                mes < 1 ||
                mes > 12 ||
                new Date(2000 + ano, mes) <=
                new Date(hoje.getFullYear(), hoje.getMonth())
            ) {
                return res.status(400).json({
                    erro: 'Cartão vencido ou com validade inválida.'
                });
            }

            if (cvvLimpo.length !== 3) {
                return res.status(400).json({
                    erro: 'CVV inválido.'
                });
            }

            if (!email || !email.includes('@')) {
                return res.status(400).json({
                    erro: 'E-mail inválido.'
                });
            }

            if (String(cep || '').replace(/\D/g, '').length !== 8) {
                return res.status(400).json({
                    erro: 'CEP inválido.'
                });
            }

            if (!numero || !String(numero).trim()) {
                return res.status(400).json({
                    erro: 'Número do endereço obrigatório.'
                });
            }
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

        if (
            pagamentoExistente &&
            pagamentoExistente.status === 'Pendente' &&
            pagamentoExistente.asaasPaymentId &&
            pagamentoExistente.metodo === metodo &&
            metodo !== 'Cartão de Crédito'
        ) {
            if (pagamentoExistente.metodo === 'Pix') {
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
            }

            return res.status(200).json({
                mensagem: 'Pagamento existente recuperado.',
                pagamento: pagamentoExistente
            });
        }

        if (
            pagamentoExistente &&
            pagamentoExistente.status === 'Pendente' &&
            pagamentoExistente.asaasPaymentId &&
            pagamentoExistente.metodo !== metodo
        ) {
            return res.status(400).json({
                erro: `Já existe um pagamento pendente por ${pagamentoExistente.metodo} para esta reserva. Finalize ou aguarde a expiração antes de escolher outro método.`
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
            cpf,
            {
                nome,
                sobrenome,
                telefone,
                dataNascimento,
                email,
                cep,
                rua,
                numero,
                bairro
            }
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


        const dadosCobranca = {
            customer: clienteAsaasId,
            billingType:
                metodo === 'Pix'
                    ? 'PIX'
                    : metodo === 'Boleto'
                        ? 'BOLETO'
                        : 'CREDIT_CARD',
            value: valorTotal,
            dueDate,
            description: `Reserva Easy Rent - ${reserva.imovel.titulo}`,
            externalReference: String(idReserva)
        };

        if (metodo === 'Cartão de Crédito') {
            const numeroCartaoLimpo = numeroCartao.replace(/\D/g, '');
            const cvvLimpo = cvv.replace(/\D/g, '');
            const [mes, ano] = validade.split('/');

            const nomeCompleto = `${nome.trim()} ${sobrenome.trim()}`;

            dadosCobranca.creditCard = {
                holderName: nomeCompleto,
                number: numeroCartaoLimpo,
                expiryMonth: mes,
                expiryYear: String(2000 + Number(ano)),
                ccv: cvvLimpo
            };

            dadosCobranca.creditCardHolderInfo = {
                name: nomeCompleto,
                email: email.trim(),
                cpfCnpj: cpfLimpo,
                postalCode: cep.replace(/\D/g, ''),
                addressNumber: String(numero).trim(),
                phone: telefoneLimpo,
                mobilePhone: telefoneLimpo
            };

            dadosCobranca.remoteIp = req.ip;
        }

        const respostaCobranca = await asaasApi.post(
            '/payments',
            dadosCobranca
        );

        const cobranca = respostaCobranca.data;

        let pagamento = await prisma.pagamento.create({
            data: {
                valor: valorTotal,
                metodo: metodo,
                status: 'Pendente',
                reservaId: idReserva,
                asaasPaymentId: cobranca.id,
                invoiceUrl: cobranca.bankSlipUrl || cobranca.invoiceUrl || null,
                finalCartao: metodo === 'Cartão de Crédito'
                    ? numeroCartao.replace(/\D/g, '').slice(-4)
                    : null
            }
        });

        if (metodo === 'Pix') {
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
                }
            });
        }

        pagamento = await prisma.pagamento.findUnique({
            where: {
                id: pagamento.id
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
            mensagem: metodo === 'Pix'
                ? 'Cobrança Pix criada com sucesso.'
                : metodo === 'Boleto'
                    ? 'Boleto criado com sucesso.'
                    : 'Cobrança no cartão criada com sucesso.',

            pagamento,
            threeDSecureChallengeUrl: cobranca.threeDSecureChallengeUrl || null,
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

const buscarPagamentoPorReserva = async (req, res) => {
    try {
        const usuarioId = Number(req.usuarioId);
        const reservaId = Number(req.params.reservaId);

        if (!Number.isInteger(reservaId) || reservaId <= 0) {
            return res.status(400).json({
                erro: 'Reserva inválida.'
            });
        }

        const pagamento = await prisma.pagamento.findUnique({
            where: {
                reservaId
            },
            include: {
                reserva: {
                    include: {
                        imovel: {
                            select: {
                                id: true,
                                titulo: true
                            }
                        }
                    }
                }
            }
        });

        if (!pagamento) {
            return res.status(404).json({
                erro: 'Pagamento não encontrado.'
            });
        }

        if (pagamento.reserva.hospedeId !== usuarioId) {
            return res.status(403).json({
                erro: 'Você não tem permissão para consultar este pagamento.'
            });
        }

        return res.json({
            status: pagamento.status,
            valor: pagamento.valor,
            metodo: pagamento.metodo,
            dataPagamento: pagamento.dataPagamento,
            reservaId: pagamento.reservaId,
            imovel: pagamento.reserva.imovel
        });

    } catch (error) {
        console.error('Erro ao buscar pagamento da reserva:', error);

        return res.status(500).json({
            erro: 'Erro ao consultar o pagamento.'
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
    buscarPagamentoPorReserva,
    processarWebhookAsaas
};