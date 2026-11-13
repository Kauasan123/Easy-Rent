const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STATUS_QUE_BLOQUEIAM = ['Confirmada'];

const datasValidas = (inicio, fim) => {
  const dataInicio = new Date(inicio);
  const dataFim = new Date(fim);

  return (
    !Number.isNaN(dataInicio.getTime()) &&
    !Number.isNaN(dataFim.getTime()) &&
    dataInicio < dataFim
  );
};

const bloquearImovel = async (tx, imovelId) => {
  const imoveis = await tx.$queryRaw`
        SELECT id
        FROM "Imovel"
        WHERE id = ${imovelId}
        FOR UPDATE
    `;

  return imoveis.length > 0;
};

const verificarDisponibilidade = async (
  tx,
  imovelId,
  inicio,
  fim,
  reservaIgnoradaId = null
) => {

  const periodos = await tx.periodo.findMany({
    where: { imovelId },
    select: {
      inicio: true,
      fim: true
    }
  });


  const formatarDataLocal = (data) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  };

  const dataInicioReserva = formatarDataLocal(inicio);
  const dataFimReserva = formatarDataLocal(fim);

  const periodo = periodos.find((p) => {
    const inicioPeriodo = formatarDataLocal(new Date(p.inicio));
    const fimPeriodo = formatarDataLocal(new Date(p.fim));

    return (
      dataInicioReserva >= inicioPeriodo &&
      dataFimReserva <= fimPeriodo
    );
  });


  if (!periodo) {
    console.log('Verificação de disponibilidade:', {
      imovelId,
      inicioReserva: inicio,
      fimReserva: fim,
      periodosEncontrados: periodos
    });
    return {
      disponivel: false,
      motivo: 'As datas estão fora dos períodos de disponibilidade.'
    };
  }

  const conflito = await tx.reserva.findFirst({
    where: {
      imovelId,
      status: { in: STATUS_QUE_BLOQUEIAM },
      inicio: { lt: fim },
      fim: { gt: inicio },
      ...(reservaIgnoradaId !== null && {
        id: { not: reservaIgnoradaId }
      })
    },
    select: { id: true }
  });

  if (conflito) {
    return {
      disponivel: false,
      motivo: 'O imóvel já possui uma reserva confirmada para essas datas.'
    };
  }

  return { disponivel: true };
};

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
    const {
      inicio,
      fim,
      hospedes,
      imovelId
    } = req.body;

    const idImovel = Number(imovelId);
    const idHospede = Number(req.usuarioId);
    const quantidadeHospedes = Number(hospedes);

    if (
      !Number.isInteger(idImovel) ||
      idImovel <= 0 ||
      !Number.isInteger(idHospede) ||
      idHospede <= 0 ||
      !Number.isInteger(quantidadeHospedes) ||
      quantidadeHospedes <= 0 ||
      !datasValidas(inicio, fim)
    ) {
      return res.status(400).json({
        erro: 'Dados da reserva inválidos.'
      });
    }

    const dataInicio = new Date(inicio);
    const dataFim = new Date(fim);

    const resultado = await prisma.$transaction(async (tx) => {
      const bloqueado = await bloquearImovel(tx, idImovel);

      if (!bloqueado) {
        return {
          erro: 'Imóvel não encontrado.',
          status: 404
        };
      }

      const imovel = await tx.imovel.findUnique({
        where: { id: idImovel },
        select: { id: true, capacidade: true }
      });

      const hospede = await tx.usuario.findUnique({
        where: { id: idHospede },
        select: { id: true }
      });

      if (!hospede) {
        return {
          erro: 'Usuário não encontrado.',
          status: 404
        };
      }

      if (!imovel) {
        return {
          erro: 'Imóvel não encontrado.',
          status: 404
        };
      }

      const disponibilidade = await verificarDisponibilidade(
        tx,
        idImovel,
        dataInicio,
        dataFim
      );

      if (!disponibilidade.disponivel) {
        return {
          erro: disponibilidade.motivo,
          status: 409
        };
      }

      const codigo = gerarCodigoReserva();

      const reserva = await tx.reserva.create({
        data: {
          codigo,
          inicio: dataInicio,
          fim: dataFim,
          hospedes: quantidadeHospedes,
          status: 'Pendente',
          imovelId: idImovel,
          hospedeId: idHospede
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

      return { reserva };
    });

    if (resultado.erro) {
      return res.status(resultado.status).json({
        erro: resultado.erro
      });
    }

    return res.status(201).json(resultado.reserva);
  } catch (error) {
    console.error('Erro ao criar reserva:', error);

    return res.status(500).json({
      erro: 'Erro ao criar reserva.',
      detalhes: error.message
    });
  }
};

const listarReservasPorImovel = async (req, res) => {
  try {
    const { imovelId } = req.params;
    const idImovel = Number(imovelId);
    const idUsuario = Number(req.usuarioId);

    if (!Number.isInteger(idImovel) || idImovel <= 0) {
      return res.status(400).json({
        erro: "ID do imóvel inválido."
      });
    }

    const imovel = await prisma.imovel.findUnique({
      where: { id: idImovel },
      select: { usuarioId: true }
    });

    if (!imovel) {
      return res.status(404).json({
        erro: "Imóvel não encontrado."
      });
    }

    const ehProprietario = imovel.usuarioId === idUsuario;

    // O proprietário pode consultar as reservas completas.
    if (ehProprietario) {
      const reservas = await prisma.reserva.findMany({
        where: { imovelId: idImovel },
        include: { hospede: true },
        orderBy: { inicio: 'asc' }
      });

      return res.json(reservas);
    }

    // Outros usuários recebem somente as datas ocupadas.
    const reservas = await prisma.reserva.findMany({
      where: {
        imovelId: idImovel,
        status: 'Confirmada'
      },
      select: {
        id: true,
        inicio: true,
        fim: true,
        status: true
      },
      orderBy: { inicio: 'asc' }
    });

    return res.json(reservas);

  } catch (error) {
    console.error("Erro ao buscar reservas do imóvel:", error);

    return res.status(500).json({
      erro: "Erro ao buscar reservas.",
      detalhes: error.message
    });
  }
};

const listarReservasPorUsuario = async (req, res) => {
  try {
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
    const id = Number(req.params.id);
    const { status } = req.body;
    const usuarioId = req.usuarioId;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        erro: 'ID de reserva inválido.'
      });
    }

    if (status !== 'Cancelada') {
      return res.status(400).json({
        erro: 'Esta rota permite apenas cancelar uma reserva.'
      });
    }

    const resultado = await prisma.$transaction(async (tx) => {
      const reservaInicial = await tx.reserva.findUnique({
        where: { id }
      });

      if (!reservaInicial) {
        return {
          erro: 'Reserva não encontrada.',
          status: 404
        };
      }

      if (reservaInicial.hospedeId !== usuarioId) {
        return {
          erro: 'Você não tem permissão para cancelar esta reserva.',
          status: 403
        };
      }

      const bloqueado = await bloquearImovel(
        tx,
        reservaInicial.imovelId
      );

      if (!bloqueado) {
        return {
          erro: 'Imóvel não encontrado.',
          status: 404
        };
      }

      // Consulta novamente após o bloqueio para verificar o status atual.
      const reserva = await tx.reserva.findUnique({
        where: { id }
      });

      if (!reserva) {
        return {
          erro: 'Reserva não encontrada.',
          status: 404
        };
      }

      if (reserva.hospedeId !== usuarioId) {
        return {
          erro: 'Você não tem permissão para cancelar esta reserva.',
          status: 403
        };
      }

      if (reserva.status !== 'Confirmada') {
        return {
          erro: 'Somente reservas confirmadas podem ser canceladas.',
          status: 409
        };
      }

      const reservaAtualizada = await tx.reserva.update({
        where: { id },
        data: { status: 'Cancelada' },
        include: {
          imovel: {
            include: {
              imagens: true
            }
          },
          hospede: true
        }
      });

      return { reserva: reservaAtualizada };
    });

    if (resultado.erro) {
      return res.status(resultado.status).json({
        erro: resultado.erro
      });
    }

    return res.json(resultado.reserva);

  } catch (error) {
    console.error('Erro ao atualizar status da reserva:', error);

    return res.status(500).json({
      erro: 'Erro ao atualizar status da reserva.',
      detalhes: error.message
    });
  }
};

const buscarReservaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const reservaId = Number(id);

    if (!Number.isInteger(reservaId)) {
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

    const usuarioAutenticado = req.usuarioId;
    const ehHospede = reserva.hospedeId === usuarioAutenticado;
    const ehProprietario = reserva.imovel.usuarioId === usuarioAutenticado;

    if (!ehHospede && !ehProprietario) {
      return res.status(403).json({
        erro: "Você não tem permissão para visualizar esta reserva."
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