const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const criarReserva = async (req, res) => {
  try {
    const { inicio, fim, imovelId, hospedeId } = req.body;

    const novaReserva = await prisma.reserva.create({
      data: {
        inicio: new Date(inicio),
        fim: new Date(fim),
        status: 'Pendente',
        imovelId: parseInt(imovelId),
        hospedeId: parseInt(hospedeId)
      },
      include: { imovel: true, hospede: true }
    });

    return res.status(201).json({ mensagem: "Reserva criada!", reserva: novaReserva });
  } catch (error) {
    return res.status(500).json({ erro: "Erro ao criar reserva", detalhes: error.message });
  }
};

const listarReservasPorImovel = async (req, res) => {
  try {
    const { imovelId } = req.params;

    const reservas = await prisma.reserva.findMany({
      where: { imovelId: parseInt(imovelId) },
      include: { hospede: true },
      orderBy: { inicio: 'asc' }
    });

    return res.json(reservas);
  } catch (error) {
    return res.status(500).json({ erro: "Erro ao buscar reservas", detalhes: error.message });
  }
};

const listarReservasPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const reservas = await prisma.reserva.findMany({
      where: { hospedeId: parseInt(usuarioId) },
      include: { imovel: { include: { imagens: true } } },
      orderBy: { inicio: 'asc' }
    });

    return res.json(reservas);
  } catch (error) {
    return res.status(500).json({ erro: "Erro ao buscar reservas do usuário", detalhes: error.message });
  }
};

const atualizarStatusReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const statusValidos = ['Pendente', 'Confirmada', 'Cancelada'];
    if (!statusValidos.includes(status)) {
      return res.status(400).json({ erro: "Status inválido" });
    }

    const reserva = await prisma.reserva.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    return res.json({ mensagem: "Status atualizado!", reserva });
  } catch (error) {
    return res.status(500).json({ erro: "Erro ao atualizar status", detalhes: error.message });
  }
};

module.exports = {
  criarReserva,
  listarReservasPorImovel,
  listarReservasPorUsuario,
  atualizarStatusReserva
};