require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const imovelRoutes = require('./routes/imovelRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');
const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }
});

app.set('io', io);

app.use(cors());
app.use(express.json());

app.use('/api', imovelRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', reservaRoutes);
app.use('/api', avaliacaoRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api', pagamentoRoutes);

app.get('/', (req, res) => {
  return res.json({
    status: 'Backend EasyRent 100% Operacional!'
  });
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error('Autenticação necessária.'));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!Number.isInteger(payload.usuarioId)) {
      return next(new Error('Token inválido.'));
    }

    socket.data.usuarioId = payload.usuarioId;
    next();
  } catch (error) {
    next(new Error('Token inválido ou expirado.'));
  }
});

io.on('connection', (socket) => {
  socket.on('entrarConversa', async (conversaIdRecebido) => {
    try {
      const conversaId = Number(conversaIdRecebido);

      if (!Number.isInteger(conversaId) || conversaId <= 0) {
        console.log('ID de conversa inválido:', conversaIdRecebido);
        return;
      }

      const conversa = await prisma.conversa.findFirst({
        where: {
          id: conversaId,
          OR: [
            { locatarioId: socket.data.usuarioId },
            { proprietarioId: socket.data.usuarioId }
          ]
        },
        select: {
          id: true
        }
      });

      if (!conversa) {
        console.log(
          `Acesso negado: usuário ${socket.data.usuarioId}, conversa ${conversaId}`
        );

        socket.emit('erroChat', {
          mensagem: 'Você não tem acesso a esta conversa.'
        });

        return;
      }

      socket.join(`conversa:${conversa.id}`);

    } catch (error) {
      console.error('Erro ao entrar na conversa:', error);

      socket.emit('erroChat', {
        mensagem: 'Não foi possível conectar à conversa.'
      });
    }
  });

  socket.on('sairConversa', (conversaIdRecebido) => {
    const conversaId = Number(conversaIdRecebido);

    if (Number.isInteger(conversaId) && conversaId > 0) {
      socket.leave(`conversa:${conversaId}`);

      console.log(
        `Usuário ${socket.data.usuarioId} saiu da conversa ${conversaId}`
      );
    }
  });

});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}!`);
});