const express = require('express');
const router = express.Router();
const avaliacaoController = require('../controllers/avaliacaoController');

router.post('/avaliacoes', avaliacaoController.criarAvaliacao);
router.get('/avaliacoes/imovel/:imovelId', avaliacaoController.listarAvaliacoesPorImovel);

module.exports = router;