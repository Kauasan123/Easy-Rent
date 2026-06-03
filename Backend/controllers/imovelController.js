const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const criarImovel = async (req, res) => {
  try {
    const dadosImovel = req.body;

    const arquivos = req.files || [];
    const fotosDados = arquivos.map(file => ({ path: `/uploads/imoveis/${file.filename}` }));

    const novoImovel = await prisma.imovel.create({
      data: {
        // Informações básicas
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
        
        // Comodidades
        hasWifi: dadosImovel.hasWifi === 'true',
        hasArCondicionado: dadosImovel.hasArCondicionado === 'true',
        hasEstacionamento: dadosImovel.hasEstacionamento === 'true',
        hasPiscina: dadosImovel.hasPiscina === 'true',
        hasTv: dadosImovel.hasTv === 'true',
        hasMaquinaLavar: dadosImovel.hasMaquinaLavar === 'true',
        hasChurrascaria: dadosImovel.hasChurrascaria === 'true',
        hasElevador: dadosImovel.hasElevador === 'true',
        hasPortaria24h: dadosImovel.hasPortaria24h === 'true',

        // Detalhes
        proximoCentro: dadosImovel.proximoCentro === 'true',
        proximoPraia: dadosImovel.proximoPraia === 'true',
        quartos: parseInt(dadosImovel.quartos) || 1,
        banheiros: parseInt(dadosImovel.banheiros) || 1,
        vagas: parseInt(dadosImovel.vagas) || 1,

        // Regras
        aceitaPets: dadosImovel.aceitaPets === 'true',
        permiteFestas: dadosImovel.permiteFestas === 'true',
        acessibilidade: dadosImovel.acessibilidade === 'true',
        naoFumante: dadosImovel.naoFumante === 'true',

        usuarioId: parseInt(dadosImovel.usuarioId) || 1,

        fotos: {
          create: fotosDados
        }
      },
      include: {
        fotos: true
      }
    });

    return res.status(201).json({ mensagem: "Imóvel cadastrado com sucesso!", imovel: novoImovel });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao cadastrar imóvel", detalhes: error.message });
  }
};

const listarImoveis = async (req, res) => {
  try {
    const imoveis = await prisma.imovel.findMany({
      include: {
        fotos: true
      }
    });
    return res.json(imoveis);
  } catch (error) {
    return res.status(500).json({ erro: "Erro ao buscar imóveis", detalhes: error.message });
  }
};

const atualizarImovel = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosImovel = req.body;

    const arquivos = req.files || [];
    const novasFotos = arquivos.map(file => ({ path: `/uploads/imoveis/${file.filename}` }));

    const imovelAtualizado = await prisma.imovel.update({
      where: { id: parseInt(id) },
      data: {
        // Informações básicas
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
        
        // Comodidades Booleans
        hasWifi: dadosImovel.hasWifi === 'true',
        hasArCondicionado: dadosImovel.hasArCondicionado === 'true',
        hasEstacionamento: dadosImovel.hasEstacionamento === 'true',
        hasPiscina: dadosImovel.hasPiscina === 'true',
        hasTv: dadosImovel.hasTv === 'true',
        hasMaquinaLavar: dadosImovel.hasMaquinaLavar === 'true',
        hasChurrascaria: dadosImovel.hasChurrascaria === 'true',
        hasElevador: dadosImovel.hasElevador === 'true',
        hasPortaria24h: dadosImovel.hasPortaria24h === 'true',

        // Detalhes
        proximoCentro: dadosImovel.proximoCentro === 'true',
        proximoPraia: dadosImovel.proximoPraia === 'true',
        quartos: parseInt(dadosImovel.quartos) || 1,
        banheiros: parseInt(dadosImovel.banheiros) || 1,
        vagas: parseInt(dadosImovel.vagas) || 1,

        // Regras
        aceitaPets: dadosImovel.aceitaPets === 'true',
        permiteFestas: dadosImovel.permiteFestas === 'true',
        acessibilidade: dadosImovel.acessibilidade === 'true',
        naoFumante: dadosImovel.naoFumante === 'true',

        ...(novasFotos.length > 0 && {
          fotos: {
            create: novasFotos
          }
        })
      },
      include: {
        fotos: true
      }
    });

    return res.json({ mensagem: "Imóvel atualizado com sucesso!", imovel: imovelAtualizado });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao atualizar imóvel", detalhes: error.message });
  }
};

module.exports = {
  criarImovel,
  listarImoveis,
  atualizarImovel
};