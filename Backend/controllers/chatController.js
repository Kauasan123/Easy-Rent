const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const listarConversas = async (req, res) => {
    try {
        const usuarioId = req.usuarioId;

        const conversas = await prisma.conversa.findMany({
            where: {
                OR: [
                    { locatarioId: usuarioId },
                    { proprietarioId: usuarioId }
                ]
            },
            include: {
                _count: {
                    select: {
                        mensagens: {
                            where: {
                                remetenteId: {
                                    not: req.usuarioId
                                },
                                lidaEm: null
                            }
                        }
                    }
                },
                imovel: {
                    select: {
                        id: true,
                        titulo: true,
                        imagens: {
                            take: 1,
                            select: { url: true }
                        }
                    }
                },
                locatario: {
                    select: { id: true, nome: true, avatarPath: true }
                },
                proprietario: {
                    select: { id: true, nome: true, avatarPath: true }
                },
                mensagens: {
                    orderBy: { criadaEm: 'desc' },
                    take: 1,
                    select: {
                        id: true,
                        texto: true,
                        criadaEm: true,
                        remetenteId: true,
                        lidaEm: true
                    }
                }
            },
            orderBy: { atualizadaEm: 'desc' }
        });

        const resultado = conversas.map((conversa) => ({
            ...conversa,
            outroUsuario:
                conversa.locatarioId === usuarioId
                    ? conversa.proprietario
                    : conversa.locatario,
            naoLidas: conversa._count?.mensagens ?? 0
        }));

        return res.json(resultado);
    } catch (error) {
        console.error('Erro ao listar conversas:', error);
        return res.status(500).json({ erro: 'Não foi possível carregar as conversas.' });
    }
};

const criarConversa = async (req, res) => {
    try {
        const usuarioId = req.usuarioId;
        const imovelId = Number(req.body.imovelId);

        if (!Number.isInteger(imovelId) || imovelId <= 0) {
            return res.status(400).json({ erro: 'Informe um imóvel válido.' });
        }

        const imovel = await prisma.imovel.findUnique({
            where: { id: imovelId },
            select: { id: true, usuarioId: true }
        });

        if (!imovel) {
            return res.status(404).json({ erro: 'Imóvel não encontrado.' });
        }

        if (imovel.usuarioId === usuarioId) {
            return res.status(400).json({
                erro: 'Você não pode iniciar uma conversa consigo mesmo.'
            });
        }

        const conversa = await prisma.conversa.upsert({
            where: {
                imovelId_locatarioId: {
                    imovelId,
                    locatarioId: usuarioId
                }
            },
            update: {},
            create: {
                imovelId,
                locatarioId: usuarioId,
                proprietarioId: imovel.usuarioId
            },
            include: {
                imovel: {
                    select: { id: true, titulo: true }
                },
                locatario: {
                    select: { id: true, nome: true, avatarPath: true }
                },
                proprietario: {
                    select: { id: true, nome: true, avatarPath: true }
                }
            }
        });

        return res.status(200).json(conversa);
    } catch (error) {
        console.error('Erro ao criar conversa:', error);
        return res.status(500).json({ erro: 'Não foi possível abrir a conversa.' });
    }
};

const listarMensagens = async (req, res) => {
    try {
        const usuarioId = req.usuarioId;
        const conversaId = Number(req.params.conversaId);

        if (!Number.isInteger(conversaId) || conversaId <= 0) {
            return res.status(400).json({ erro: 'Conversa inválida.' });
        }

        const conversa = await prisma.conversa.findFirst({
            where: {
                id: conversaId,
                OR: [
                    { locatarioId: usuarioId },
                    { proprietarioId: usuarioId }
                ]
            },
            select: { id: true }
        });

        if (!conversa) {
            return res.status(404).json({ erro: 'Conversa não encontrada.' });
        }

        const mensagens = await prisma.mensagem.findMany({
            where: { conversaId },
            orderBy: { criadaEm: 'asc' },
            include: {
                remetente: {
                    select: { id: true, nome: true, avatarPath: true }
                }
            }
        });

        return res.json(mensagens);
    } catch (error) {
        console.error('Erro ao listar mensagens:', error);
        return res.status(500).json({ erro: 'Não foi possível carregar as mensagens.' });
    }
};

const enviarMensagem = async (req, res) => {
    try {
        const usuarioId = req.usuarioId;
        const conversaId = Number(req.params.conversaId);
        const texto = typeof req.body.texto === 'string'
            ? req.body.texto.trim()
            : '';

        if (!Number.isInteger(conversaId) || conversaId <= 0) {
            return res.status(400).json({ erro: 'Conversa inválida.' });
        }

        if (!texto) {
            return res.status(400).json({ erro: 'A mensagem não pode estar vazia.' });
        }

        if (texto.length > 5000) {
            return res.status(400).json({
                erro: 'A mensagem deve ter no máximo 5000 caracteres.'
            });
        }

        const conversa = await prisma.conversa.findFirst({
            where: {
                id: conversaId,
                OR: [
                    { locatarioId: usuarioId },
                    { proprietarioId: usuarioId }
                ]
            },
            select: {
                id: true,
                locatarioId: true,
                proprietarioId: true
            }
        });

        if (!conversa) {
            return res.status(404).json({ erro: 'Conversa não encontrada.' });
        }

        const mensagem = await prisma.$transaction(async (tx) => {
            const novaMensagem = await tx.mensagem.create({
                data: {
                    texto,
                    conversaId,
                    remetenteId: usuarioId
                },
                include: {
                    remetente: {
                        select: {
                            id: true,
                            nome: true,
                            avatarPath: true
                        }
                    }
                }
            });

            await tx.conversa.update({
                where: { id: conversaId },
                data: { atualizadaEm: new Date() }
            });

            return novaMensagem;
        });

        const io = req.app.get('io');

        if (io) {
            io.to(`conversa:${conversaId}`).emit('novaMensagem', mensagem);
        }

        return res.status(201).json(mensagem);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        return res.status(500).json({
            erro: 'Não foi possível enviar a mensagem.'
        });
    }
};

const marcarComoLidas = async (req, res) => {
    try {
        const usuarioId = req.usuarioId;
        const conversaId = Number(req.params.conversaId);

        if (!Number.isInteger(conversaId) || conversaId <= 0) {
            return res.status(400).json({ erro: 'Conversa inválida.' });
        }

        const conversa = await prisma.conversa.findFirst({
            where: {
                id: conversaId,
                OR: [
                    { locatarioId: usuarioId },
                    { proprietarioId: usuarioId }
                ]
            },
            select: { id: true }
        });

        if (!conversa) {
            return res.status(404).json({ erro: 'Conversa não encontrada.' });
        }

        await prisma.mensagem.updateMany({
            where: {
                conversaId,
                remetenteId: { not: usuarioId },
                lidaEm: null
            },
            data: { lidaEm: new Date() }
        });

        return res.json({ mensagem: 'Mensagens marcadas como lidas.' });
    } catch (error) {
        console.error('Erro ao marcar mensagens como lidas:', error);
        return res.status(500).json({ erro: 'Não foi possível atualizar as mensagens.' });
    }
};

module.exports = {
    listarConversas,
    criarConversa,
    listarMensagens,
    enviarMensagem,
    marcarComoLidas
};