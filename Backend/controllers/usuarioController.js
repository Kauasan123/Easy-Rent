const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const supabase = require('../config/supabase');
const sharp = require('sharp');

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
  let nomeArquivo;
  let avatarFoiEnviado = false;

  try {
    const usuarioId = parseInt(req.params.id, 10);

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
      return res.status(400).json({
        erro: 'ID de usuário inválido.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        erro: 'Nenhum arquivo enviado.'
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        avatarPath: true
      }
    });

    if (!usuario) {
      return res.status(404).json({
        erro: 'Usuário não encontrado.'
      });
    }

    const tiposPermitidos = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif'
    ];

    if (!tiposPermitidos.includes(req.file.mimetype)) {
      return res.status(400).json({
        erro: 'Envie uma imagem JPG, PNG, WebP ou AVIF.'
      });
    }

    const imagemConvertida = await sharp(req.file.buffer)
      .rotate()
      .resize(1024, 1024, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 85 })
      .toBuffer();

    nomeArquivo = `avatar-${usuarioId}.webp`;

    const storage = supabase.storage.from('avatares');

    const { data: arquivos, error: listError } = await storage.list('', {
      search: nomeArquivo,
      limit: 100
    });

    if (listError) {
      throw listError;
    }

    const arquivoExiste = arquivos?.some(
      arquivo => arquivo.name === nomeArquivo
    );

    let resultadoUpload;

    if (arquivoExiste) {
      resultadoUpload = await storage.update(
        nomeArquivo,
        imagemConvertida,
        {
          contentType: 'image/webp',
          cacheControl: '0'
        }
      );
    } else {
      resultadoUpload = await storage.upload(
        nomeArquivo,
        imagemConvertida,
        {
          contentType: 'image/webp',
          cacheControl: '0',
          upsert: false
        }
      );
    }

    if (resultadoUpload.error) {
      throw resultadoUpload.error;
    }

    avatarFoiEnviado = true;

    const { data: urlData } = storage.getPublicUrl(nomeArquivo);

    const avatarPath = `${urlData.publicUrl}?v=${Date.now()}`;

    let usuarioAtualizado;

    try {
      usuarioAtualizado = await prisma.usuario.update({
        where: { id: usuarioId },
        data: { avatarPath }
      });
    } catch (erroBanco) {
      console.error(
        'A imagem foi enviada, mas o banco não foi atualizado:',
        erroBanco
      );

      throw erroBanco;
    }

    return res.status(200).json({
      mensagem: arquivoExiste
        ? 'Avatar substituído com sucesso!'
        : 'Avatar enviado com sucesso!',
      avatarPath,
      usuario: usuarioAtualizado
    });

  } catch (error) {
    console.error('ERRO AO ATUALIZAR AVATAR:', error);

    return res.status(500).json({
      erro: 'Erro interno ao salvar a imagem.',
      detalhes: error.message
    });
  }
};

const excluirUsuario = async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.id, 10);

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
      return res.status(400).json({
        erro: 'ID de usuário inválido.'
      });
    }

    if (req.usuarioId !== usuarioId) {
      return res.status(403).json({
        erro: 'Você não tem permissão para excluir esta conta.'
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        avatarPath: true,
        imoveis: {
          select: {
            imagens: {
              select: {
                url: true
              }
            }
          }
        }
      }
    });

    if (!usuario) {
      return res.status(404).json({
        erro: 'Usuário não encontrado.'
      });
    }

    const arquivosImoveis = usuario.imoveis
      .flatMap(imovel => imovel.imagens)
      .map(imagem => {
        try {
          const url = new URL(imagem.url);
          const prefixo =
            '/storage/v1/object/public/imoveis/';

          const indice = url.pathname.indexOf(prefixo);

          if (indice === -1) {
            return null;
          }

          const caminho = decodeURIComponent(
            url.pathname.slice(indice + prefixo.length)
          );

          if (
            !caminho ||
            caminho.includes('/') ||
            caminho.includes('\\') ||
            caminho.includes('..')
          ) {
            return null;
          }

          return caminho;
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    if (arquivosImoveis.length > 0) {
      const arquivosUnicos = [...new Set(arquivosImoveis)];

      const { error } = await supabase
        .storage
        .from('imoveis')
        .remove(arquivosUnicos);

      if (error) {
        console.error(
          'Erro ao remover fotos dos imóveis:',
          error
        );

        return res.status(500).json({
          erro: 'Não foi possível remover as fotos dos imóveis. A conta não foi excluída.'
        });
      }
    }

    const arquivosAvatar = [`avatar-${usuarioId}.webp`];

    if (usuario.avatarPath) {
      try {
        const url = new URL(usuario.avatarPath);
        const prefixo =
          '/storage/v1/object/public/avatares/';

        const indice = url.pathname.indexOf(prefixo);

        if (indice !== -1) {
          const caminho = decodeURIComponent(
            url.pathname.slice(indice + prefixo.length)
          );

          if (
            caminho &&
            !caminho.includes('/') &&
            !caminho.includes('\\') &&
            !caminho.includes('..')
          ) {
            arquivosAvatar.push(caminho);
          }
        }
      } catch {
      }
    }

    const { error: erroAvatar } = await supabase
      .storage
      .from('avatares')
      .remove([...new Set(arquivosAvatar)]);

    if (erroAvatar) {
      console.error(
        'Erro ao remover avatar do Supabase:',
        erroAvatar
      );
    }

    await prisma.usuario.delete({
      where: { id: usuarioId }
    });

    return res.status(200).json({
      mensagem: 'Conta excluída com sucesso.'
    });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);

    return res.status(500).json({
      erro: 'Não foi possível excluir a conta.'
    });
  }
};

module.exports = {
  criarUsuario,
  listarUsuarios,
  obterPerfil,
  atualizarPerfil,
  atualizarAvatar,
  excluirUsuario
};