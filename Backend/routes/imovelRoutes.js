const express = require('express');
const router = express.Router();
const imovelController = require('../controllers/imovelController');

router.post('/imoveis', imovelController.criarImovel); 
router.get('/imoveis', imovelController.listarImoveis);

module.exports = router;