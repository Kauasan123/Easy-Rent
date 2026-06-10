const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const criarAvaliacao = async (req, res) => {
  try {
    const { nota, comentario, imovelId, autorId } = req.body;

    const reservaConfirmada = await prisma.reserva.findFirst({
      where: {
        imovelId: parseInt(imovelId),
        hospedeId: parseInt(autorId),
        status: 'Confirmada'
      }
    });

    if (!reservaConfirmada) {
      return res.status(403).json({ erro: "Você só pode avaliar imóveis com reserva confirmada." });
    }

    const jaAvaliou = await prisma.avaliacao.findFirst({
      where: {
        imovelId: parseInt(imovelId),
        autorId: parseInt(autorId)
      }
    });

    if (jaAvaliou) {
      return res.status(400).json({ erro: "Você já avaliou este imóvel." });
    }

    const novaAvaliacao = await prisma.avaliacao.create({
      data: {
        nota: parseFloat(nota),
        comentario,
        imovelId: parseInt(imovelId),
        autorId: parseInt(autorId)
      },
      include: { autor: true }
    });

    return res.status(201).json({ mensagem: "Avaliação criada!", avaliacao: novaAvaliacao });
  } catch (error) {
    return res.status(500).json({ erro: "Erro ao criar avaliação", detalhes: error.message });
  }
};

const listarAvaliacoesPorImovel = async (req, res) => {
  try {
    const { imovelId } = req.params;

    const avaliacoes = await prisma.avaliacao.findMany({
      where: { imovelId: parseInt(imovelId) },
      include: { autor: true },
      orderBy: { criadoEm: 'desc' }
    });

    const media = avaliacoes.length > 0
      ? avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length
      : 0;

    return res.json({ avaliacoes, media: media.toFixed(1), total: avaliacoes.length });
  } catch (error) {
    return res.status(500).json({ erro: "Erro ao buscar avaliações", detalhes: error.message });
  }
};

module.exports = { criarAvaliacao, listarAvaliacoesPorImovel };