const express = require('express');
const router = express.Router();
const imovelController = require('../controllers/imovelController');
const uploadImovel = require('../config/imovelUploadConfig');

router.post('/imoveis', uploadImovel.array('imagens', 10), imovelController.criarImovel); 
router.get('/imoveis', imovelController.listarImoveis);
router.put('/imoveis/:id', uploadImovel.array('imagens', 10), imovelController.atualizarImovel);

module.exports = router;