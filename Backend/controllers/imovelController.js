const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const criarImovel = async (req, res) => {
  try {
    const dadosImovel = req.body;

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
        hasWifi: dadosImovel.hasWifi || false,
        hasArCondicionado: dadosImovel.hasArCondicionado || false,
        hasEstacionamento: dadosImovel.hasEstacionamento || false,
        hasPiscina: dadosImovel.hasPiscina || false,
        hasTv: dadosImovel.hasTv || false,
        hasMaquinaLavar: dadosImovel.hasMaquinaLavar || false,
        hasChurrascaria: dadosImovel.hasChurrascaria || false,
        hasElevador: dadosImovel.hasElevador || false,
        hasPortaria24h: dadosImovel.hasPortaria24h || false,

        // Detalhes
        proximoCentro: dadosImovel.proximoCentro || false,
        proximoPraia: dadosImovel.proximoPraia || false,
        quartos: parseInt(dadosImovel.quartos) || 1,
        banheiros: parseInt(dadosImovel.banheiros) || 1,
        vagas: parseInt(dadosImovel.vagas) || 1,

        // Regras
        aceitaPets: dadosImovel.aceitaPets || false,
        permiteFestas: dadosImovel.permiteFestas || false,
        acessibilidade: dadosImovel.acessibilidade || false,
        naoFumante: dadosImovel.naoFumante || false,

        usuarioId: parseInt(dadosImovel.usuarioId) || 1,

        fotos: {
          create: dadosImovel.fotos ? dadosImovel.fotos.map(path => ({ path })) : []
        }
      },
      include: {
        fotos: true
      }
    });

    return res.status(201).json({ mensagem: "Imóvel cadastrado com sucesso!", imovel: novoImovel });
  } catch (error) {
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

module.exports = {
  criarImovel,
  listarImoveis
};