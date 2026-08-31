const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const supabase = require('../config/supabase');

const criarUsuario = async (req, res) => {
  try {
    const { nome, email, telefone, senha } = req.body;

    const usuarioExiste = await prisma.usuario.findUnique({ where: { email } });
    if (usuarioExiste) {
      return res.status(400).json({ erro: "E-mail já cadastrado." });
    }

    const novoUsuario = await prisma.usuario.create({
      data: { nome, email, telefone, senha }
    });

    return res.status(201).json(novoUsuario);
  } catch (error) {
    return res.status(500).json({ erro: "Erro ao criar usuário", detalhes: error.message });
  }
};

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    return res.json(usuarios);
  } catch (error) {
    return res.status(500).json({ erro: "Erro ao buscar usuários", detalhes: error.message });
  }
};

const obterPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
      include: { imoveis: true }
    });

    if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });
    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({ erro: "Erro ao buscar perfil", detalhes: error.message });
  }
};

const atualizarPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, avatarPath, senha } = req.body;

    const dadosParaAtualizar = { nome, email, telefone, avatarPath };

    if (senha && senha.trim() !== "") {
      dadosParaAtualizar.senha = senha; 
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: dadosParaAtualizar
    });

    return res.json({ mensagem: "Perfil atualizado com sucesso!", usuario: usuarioAtualizado });
  } catch (error) {
    return res.status(500).json({ erro: "Erro ao atualizar perfil", detalhes: error.message });
  }
};

const atualizarAvatar = async (req, res) => {
  try {
    const usuarioId = req.params.id;

    if (!req.file) {
      return res.status(400).json({
        erro: 'Nenhum arquivo enviado.'
      });
    }

    const extensao = req.file.originalname.split('.').pop();

    const nomeArquivo = `avatar-${usuarioId}-${Date.now()}.${extensao}`;

    const { error } = await supabase.storage
      .from('avatares')
      .upload(nomeArquivo, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from('avatares')
      .getPublicUrl(nomeArquivo);

    const avatarPath = urlData.publicUrl;

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: parseInt(usuarioId) },
      data: { avatarPath }
    });

    console.log(
      `Foto do usuário ${usuarioId} atualizada com sucesso no banco!`
    );

    return res.status(200).json({
      mensagem: 'Avatar atualizado com sucesso!',
      avatarPath: avatarPath,
      usuario: usuarioAtualizado
    });

  } catch (error) {
    console.error("ERRO AO ATUALIZAR AVATAR:", error);

    return res.status(500).json({
      erro: 'Erro interno ao salvar a imagem.',
      detalhes: error.message
    });
  }
};

module.exports = { criarUsuario, listarUsuarios, obterPerfil, atualizarPerfil, atualizarAvatar };