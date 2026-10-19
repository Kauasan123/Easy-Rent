const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const criarPagamento = async (req, res) => {
    try {
        const {
            valor,
            metodo,
            finalCartao,
            status,
            dataPagamento,
            reservaId
        } = req.body;

        const reserva = await prisma.reserva.findUnique({
            where: {
                id: Number(reservaId)
            }
        });

        if (!reserva) {
            return res.status(404).json({
                erro: "Reserva não encontrada"
            });
        }

        const pagamentoExistente = await prisma.pagamento.findUnique({
            where: {
                reservaId: Number(reservaId)
            }
        });

        if (pagamentoExistente) {
            return res.status(400).json({
                erro: "Esta reserva já possui um pagamento"
            });
        }

        const pagamento = await prisma.pagamento.create({
            data: {
                valor: Number(valor),
                metodo,
                finalCartao: finalCartao || null,
                status: status || 'Pendente',
                dataPagamento: dataPagamento
                    ? new Date(dataPagamento)
                    : null,
                reservaId: Number(reservaId)
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
            mensagem: "Pagamento criado!",
            pagamento
        });

    } catch (error) {
        console.error("Erro ao criar pagamento:", error);

        return res.status(500).json({
            erro: "Erro ao criar pagamento",
            detalhes: error.message
        });
    }
};

const listarPagamentosPorUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const id = parseInt(usuarioId, 10);

        if (isNaN(id)) {
            return res.status(400).json({
                erro: "ID de usuário inválido"
            });
        }

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
                            },
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
        console.error("Erro ao buscar pagamentos do usuário:", error);

        return res.status(500).json({
            erro: "Erro ao buscar pagamentos do usuário",
            detalhes: error.message
        });
    }
};

module.exports = {
    criarPagamento,
    listarPagamentosPorUsuario
};