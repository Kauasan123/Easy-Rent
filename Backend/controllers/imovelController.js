const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const supabase = require('../config/supabase');

const criarImovel = async (req, res) => {
  try {
    const dadosImovel = req.body;

    const arquivos = req.files || [];
    const imagensDados = [];

    for (const file of arquivos) {
      const extensao = file.originalname.split('.').pop();

      const nomeArquivo = `imovel-${Date.now()}-${Math.round(Math.random() * 1E9)}.${extensao}`;

      const { error } = await supabase.storage
        .from('imoveis')
        .upload(nomeArquivo, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('imoveis')
        .getPublicUrl(nomeArquivo);

      imagensDados.push({
        url: urlData.publicUrl
      });
    }

    const periodos = dadosImovel.periodos ? JSON.parse(dadosImovel.periodos) : [];

    const novoImovel = await prisma.imovel.create({
      data: {
        titulo: dadosImovel.titulo,
        tipo: dadosImovel.tipo,
        descricao: dadosImovel.descricao,
        cidade: dadosImovel.cidade,
        bairro: dadosImovel.bairro,
        endereco: dadosImovel.endereco,
        cep: dadosImovel.cep,
        preco: parseFloat(dadosImovel.preco),
        tipoCobranca: dadosImovel.tipoCobranca,
        capacidade: dadosImovel.capacidade,
        hasWifi: dadosImovel.hasWifi === 'true',
        hasArCondicionado: dadosImovel.hasArCondicionado === 'true',
        hasEstacionamento: dadosImovel.hasEstacionamento === 'true',
        hasPiscina: dadosImovel.hasPiscina === 'true',
        hasTv: dadosImovel.hasTv === 'true',
        hasMaquinaLavar: dadosImovel.hasMaquinaLavar === 'true',
        hasChurrascaria: dadosImovel.hasChurrascaria === 'true',
        hasElevador: dadosImovel.hasElevador === 'true',
        hasPortaria24h: dadosImovel.hasPortaria24h === 'true',
        proximoCentro: dadosImovel.proximoCentro === 'true',
        proximoPraia: dadosImovel.proximoPraia === 'true',
        quartos: parseInt(dadosImovel.quartos) || 1,
        banheiros: parseInt(dadosImovel.banheiros) || 1,
        vagas: parseInt(dadosImovel.vagas) || 1,
        aceitaPets: dadosImovel.aceitaPets === 'true',
        permiteFestas: dadosImovel.permiteFestas === 'true',
        acessibilidade: dadosImovel.acessibilidade === 'true',
        naoFumante: dadosImovel.naoFumante === 'true',
        usuarioId: parseInt(dadosImovel.usuarioId) || 1,
        imagens: { create: imagensDados },

        periodos: {
          create: periodos.map(p => ({
            inicio: new Date(p.inicio),
            fim: new Date(p.fim)
          }))
        }
      },
      include: { imagens: true, periodos: true }
    });

    return res.status(201).json({ mensagem: "Imóvel cadastrado!", imovel: novoImovel });
  } catch (error) {
    console.error("ERRO NO BACKEND:", error);
    return res.status(500).json({ erro: "Erro ao cadastrar imóvel", detalhes: error.message });
  }
};

const listarImoveis = async (req, res) => {
  try {
    const imoveis = await prisma.imovel.findMany({
      include: {
        imagens: true,
        periodos: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            avatarPath: true
          }
        }
      }
    });

    const imoveisComAvaliacoes = await Promise.all(
      imoveis.map(async (imovel) => {
        const resultado = await prisma.avaliacao.aggregate({
          where: {
            imovelId: imovel.id
          },
          _avg: {
            nota: true
          },
          _count: {
            nota: true
          }
        });

        const media = resultado._avg.nota;

        return {
          ...imovel,
          nota: media !== null
            ? Number(media.toFixed(1))
            : null,
          totalAvaliacoes: resultado._count.nota
        };
      })
    );

    return res.json(imoveisComAvaliacoes);
  } catch (error) {
    console.error("Erro ao buscar imóveis:", error);

    return res.status(500).json({
      erro: "Erro ao buscar imóveis",
      detalhes: error.message
    });
  }
};

const atualizarImovel = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosImovel = req.body;

    const periodosEnviados =
      Object.prototype.hasOwnProperty.call(dadosImovel, 'periodos');

    const periodos = periodosEnviados
      ? JSON.parse(dadosImovel.periodos)
      : null;

    const arquivos = req.files || [];
    const novasFotos = [];

    for (const file of arquivos) {
      const extensao = file.originalname.split('.').pop();

      const nomeArquivo = `imovel-${Date.now()}-${Math.round(Math.random() * 1E9)}.${extensao}`;

      const { error } = await supabase.storage
        .from('imoveis')
        .upload(nomeArquivo, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('imoveis')
        .getPublicUrl(nomeArquivo);

      novasFotos.push({
        url: urlData.publicUrl
      });
    }

    const imovelAtualizado = await prisma.imovel.update({
      where: { id: parseInt(id) },

      data: {
        titulo: dadosImovel.titulo,
        tipo: dadosImovel.tipo,
        descricao: dadosImovel.descricao,
        cidade: dadosImovel.cidade,
        bairro: dadosImovel.bairro,
        endereco: dadosImovel.endereco,
        cep: dadosImovel.cep,
        preco: parseFloat(dadosImovel.preco),
        tipoCobranca: dadosImovel.tipoCobranca,
        capacidade: dadosImovel.capacidade,

        hasWifi: dadosImovel.hasWifi === 'true',
        hasArCondicionado: dadosImovel.hasArCondicionado === 'true',
        hasEstacionamento: dadosImovel.hasEstacionamento === 'true',
        hasPiscina: dadosImovel.hasPiscina === 'true',
        hasTv: dadosImovel.hasTv === 'true',
        hasMaquinaLavar: dadosImovel.hasMaquinaLavar === 'true',
        hasChurrascaria: dadosImovel.hasChurrascaria === 'true',
        hasElevador: dadosImovel.hasElevador === 'true',
        hasPortaria24h: dadosImovel.hasPortaria24h === 'true',
        proximoCentro: dadosImovel.proximoCentro === 'true',
        proximoPraia: dadosImovel.proximoPraia === 'true',

        quartos: parseInt(dadosImovel.quartos) || 1,
        banheiros: parseInt(dadosImovel.banheiros) || 1,
        vagas: parseInt(dadosImovel.vagas) || 1,

        aceitaPets: dadosImovel.aceitaPets === 'true',
        permiteFestas: dadosImovel.permiteFestas === 'true',
        acessibilidade: dadosImovel.acessibilidade === 'true',
        naoFumante: dadosImovel.naoFumante === 'true',

        ...(novasFotos.length > 0 && {
          imagens: {
            create: novasFotos
          }
        }),

        ...(periodosEnviados && {
          periodos: {
            deleteMany: {},
            create: periodos.map(p => ({
              inicio: new Date(p.inicio),
              fim: new Date(p.fim)
            }))
          }
        })
      },

      include: {
        imagens: true,
        periodos: true
      }
    });

    return res.json({
      mensagem: "Imóvel atualizado com sucesso!",
      imovel: imovelAtualizado
    });

  } catch (error) {
    console.error("ERRO AO ATUALIZAR:", error);

    return res.status(500).json({
      erro: "Erro ao atualizar imóvel",
      detalhes: error.message
    });
  }
};

const buscarImovelPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const imovel = await prisma.imovel.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        imagens: true,
        periodos: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            avatarPath: true
          }
        }
      }
    });

    if (!imovel) {
      return res.status(404).json({
        erro: "Imóvel não encontrado"
      });
    }

    return res.json(imovel);
  } catch (error) {
    console.error("Erro ao buscar imóvel:", error);
    return res.status(500).json({
      erro: "Erro ao buscar imóvel"
    });
  }
};

const deletarImagem = async (req, res) => {
  try {
    const { id } = req.params;

    const imagem = await prisma.imagem.findUnique({
      where: { id: parseInt(id) }
    });

    if (!imagem) {
      return res.status(404).json({ erro: "Imagem não encontrada" });
    }

    const url = new URL(imagem.url);
    const caminhoArquivo = url.pathname.split('/imoveis/')[1];

    if (caminhoArquivo) {
      const { error } = await supabase.storage
        .from('imoveis')
        .remove([caminhoArquivo]);

      if (error) {
        throw error;
      }
    }

    await prisma.imagem.delete({
      where: { id: parseInt(id) }
    });

    return res.json({
      mensagem: "Imagem deletada com sucesso!"
    });

  } catch (error) {
    console.error("ERRO AO DELETAR IMAGEM:", error);

    return res.status(500).json({
      erro: "Erro ao deletar imagem",
      detalhes: error.message
    });
  }
};

const deletarImovel = async (req, res) => {
  try {
    const { id } = req.params;

    const imovel = await prisma.imovel.findUnique({
      where: { id: parseInt(id) },
      include: {
        imagens: true
      }
    });

    if (!imovel) {
      return res.status(404).json({
        erro: "Imóvel não encontrado"
      });
    }

    const arquivos = imovel.imagens
      .map(imagem => {
        try {
          const url = new URL(imagem.url);
          return url.pathname.split('/imoveis/')[1];
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    if (arquivos.length > 0) {
      const { error } = await supabase.storage
        .from('imoveis')
        .remove(arquivos);

      if (error) {
        throw error;
      }
    }

    await prisma.imovel.delete({
      where: { id: parseInt(id) }
    });

    return res.json({
      mensagem: "Imóvel deletado com sucesso!"
    });

  } catch (error) {
    console.error("ERRO AO DELETAR IMÓVEL:", error);

    return res.status(500).json({
      erro: "Erro ao deletar imóvel",
      detalhes: error.message
    });
  }
};

module.exports = {
  criarImovel,
  listarImoveis,
  atualizarImovel,
  buscarImovelPorId,
  deletarImagem,
  deletarImovel
};