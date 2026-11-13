const express = require('express');
const router = express.Router();

const pagamentoController = require('../controllers/pagamentoController');
const verificaToken = require('../config/Middlewares/verificaToken');

router.post(
    '/pagamentos',
    verificaToken,
    pagamentoController.criarPagamento
);

router.get(
    '/pagamentos/usuario/:usuarioId',
    verificaToken,
    pagamentoController.listarPagamentosPorUsuario
);

router.post(
    '/webhook/asaas',
    pagamentoController.processarWebhookAsaas
);

module.exports = router;