const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController');
const verificaToken = require('../config/Middlewares/verificaToken');

router.get('/conversas', verificaToken, chatController.listarConversas);
router.post('/conversas', verificaToken, chatController.criarConversa);

router.get(
  '/conversas/:conversaId/mensagens',
  verificaToken,
  chatController.listarMensagens
);

router.post(
  '/conversas/:conversaId/mensagens',
  verificaToken,
  chatController.enviarMensagem
);

router.patch(
  '/conversas/:conversaId/lidas',
  verificaToken,
  chatController.marcarComoLidas
);

module.exports = router;