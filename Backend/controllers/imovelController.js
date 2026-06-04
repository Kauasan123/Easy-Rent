const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const criarImovel = async (req, res) => {
  try {
    const dadosImovel = req.body;

    const arquivos = req.files || [];
    const imagensDados = arquivos.map(file => ({ url: `/uploads/imoveis/${file.filename}` }));
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
      include: { imagens: true, periodos: true }
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
    const periodos = dadosImovel.periodos ? JSON.parse(dadosImovel.periodos) : [];
    const arquivos = req.files || [];
    const novasFotos = arquivos.map(file => ({ url: `/uploads/imoveis/${file.filename}` }));

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
        ...(novasFotos.length > 0 && { imagens: { create: novasFotos } }),
        ...(periodos !== null && {
          periodos: {
            deleteMany: {},
            create: periodos.map(p => ({
              inicio: new Date(p.inicio),
              fim: new Date(p.fim)
            }))
          }
        })
      },
      include: { imagens: true, periodos: true }
    });

    return res.json({ mensagem: "Imóvel atualizado com sucesso!", imovel: imovelAtualizado });
  } catch (error) {
    console.error("ERRO AO ATUALIZAR:", error);
    return res.status(500).json({ erro: "Erro ao atualizar imóvel", detalhes: error.message });
  }
};

const buscarImovelPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const imovel = await prisma.imovel.findUnique({
      where: { id: parseInt(id) },
      include: {
        imagens: true,
        periodos: true
      }
    });

    if (!imovel) return res.status(404).json({ erro: "Imóvel não encontrado" });

    return res.json(imovel);
  } catch (error) {
    return res.status(500).json({ erro: "Erro ao buscar imóvel" });
  }
};

module.exports = {
  criarImovel,
  listarImoveis,
  atualizarImovel,
  buscarImovelPorId
};