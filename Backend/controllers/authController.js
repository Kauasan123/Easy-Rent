const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (
      typeof email !== 'string' ||
      typeof senha !== 'string' ||
      !email.trim() ||
      !senha
    ) {
      return res.status(400).json({
        erro: 'Informe o e-mail e a senha.'
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email: email.trim() }
    });

    if (!usuario) {
      return res.status(401).json({
        erro: 'E-mail ou senha incorretos.'
      });
    }

    const pareceHashBcrypt =
      /^\$2[aby]\$\d{2}\$/.test(usuario.senha);

    let senhaValida = false;

    if (pareceHashBcrypt) {
      senhaValida = await bcrypt.compare(
        senha,
        usuario.senha
      );
    } else {
      // Compatibilidade temporária com senhas antigas em texto puro.
      senhaValida = senha === usuario.senha;

      if (senhaValida) {
        const hash = await bcrypt.hash(senha, 12);

        await prisma.usuario.update({
          where: { id: usuario.id },
          data: { senha: hash }
        });
      }
    }

    if (!senhaValida) {
      return res.status(401).json({
        erro: 'E-mail ou senha incorretos.'
      });
    }

    const token = jwt.sign(
      { usuarioId: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        avatarPath: usuario.avatarPath
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);

    return res.status(500).json({
      erro: 'Não foi possível realizar o login.'
    });
  }
};

module.exports = { login };