const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const verificaToken = require('../config/Middlewares/verificaToken');

router.post('/reservas', verificaToken, reservaController.criarReserva);

router.get(
    '/reservas/imovel/:imovelId',
    verificaToken,
    reservaController.listarReservasPorImovel
);

router.get(
    '/reservas/usuario/:usuarioId',
    verificaToken,
    reservaController.listarReservasPorUsuario
);

router.get(
    '/reservas/:id',
    verificaToken,
    reservaController.buscarReservaPorId
);

router.patch(
    '/reservas/:id/status',
    verificaToken,
    reservaController.atualizarStatusReserva
);

module.exports = router;