const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');

router.post('/pagamentos', pagamentoController.criarPagamento);

router.get(
    '/pagamentos/usuario/:usuarioId',
    pagamentoController.listarPagamentosPorUsuario
);

module.exports = router;