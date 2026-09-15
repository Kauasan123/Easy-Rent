const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const gerarCodigoReserva = () => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';

  for (let i = 0; i < 10; i++) {
    codigo += caracteres.charAt(
      Math.floor(Math.random() * caracteres.length)
    );
  }

  return codigo;
};

const criarReserva = async (req, res) => {
  try {
    const { inicio, fim, hospedes, imovelId, hospedeId } = req.body;

    const novaReserva = await prisma.reserva.create({
      data: {
        codigo: gerarCodigoReserva(),
        inicio: new Date(inicio),
        fim: new Date(fim),
        hospedes: Number(hospedes),
        status: 'Pendente',
        imovelId: Number(imovelId),
        hospedeId: Number(hospedeId)
      },
      include: {
        imovel: {
          include: {
            imagens: true
          }
        },
        hospede: true
      }
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
    const id = parseInt(usuarioId);

    if (isNaN(id)) {
      return res.status(400).json({
        erro: "ID de usuário inválido"
      });
    }

    const reservas = await prisma.reserva.findMany({
      where: {
        hospedeId: id
      },
      include: {
        imovel: {
          include: {
            imagens: true
          }
        }
      },
      orderBy: {
        inicio: 'asc'
      }
    });

    const hoje = new Date();

    for (const reserva of reservas) {
      if (
        reserva.status === 'Confirmada' &&
        new Date(reserva.fim) < hoje
      ) {
        await prisma.reserva.update({
          where: {
            id: reserva.id
          },
          data: {
            status: 'Finalizado'
          }
        });

        reserva.status = 'Finalizado';
      }
    }

    return res.json(reservas);

  } catch (error) {
    console.error("Erro ao buscar reservas do usuário:", error);

    return res.status(500).json({
      erro: "Erro ao buscar reservas do usuário",
      detalhes: error.message
    });
  }
};

const atualizarStatusReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const statusValidos = ['Pendente', 'Confirmada', 'Cancelada', 'Finalizado'];
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

const buscarReservaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const reservaId = parseInt(id);

    if (isNaN(reservaId)) {
      return res.status(400).json({
        erro: "ID de reserva inválido"
      });
    }

    const reserva = await prisma.reserva.findUnique({
      where: {
        id: reservaId
      },
      include: {
        hospede: true,
        imovel: {
          include: {
            imagens: true,
            usuario: true
          }
        }
      }
    });

    if (!reserva) {
      return res.status(404).json({
        erro: "Reserva não encontrada"
      });
    }

    return res.json(reserva);

  } catch (error) {
    console.error("Erro ao buscar detalhes da reserva:", error);

    return res.status(500).json({
      erro: "Erro ao buscar detalhes da reserva",
      detalhes: error.message
    });
  }
};

module.exports = {
  criarReserva,
  listarReservasPorImovel,
  listarReservasPorUsuario,
  atualizarStatusReserva,
  buscarReservaPorId
};