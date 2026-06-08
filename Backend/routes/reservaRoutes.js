const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

router.post('/reservas', reservaController.criarReserva);
router.get('/reservas/imovel/:imovelId', reservaController.listarReservasPorImovel);
router.get('/reservas/usuario/:usuarioId', reservaController.listarReservasPorUsuario);
router.patch('/reservas/:id/status', reservaController.atualizarStatusReserva);

module.exports = router;