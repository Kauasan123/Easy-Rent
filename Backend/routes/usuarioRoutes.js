const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const upload = require('../config/uploadConfig');
const verificaToken = require('../config/Middlewares/verificaToken');

router.post('/usuarios', usuarioController.criarUsuario);
router.get('/usuarios', usuarioController.listarUsuarios);
router.get('/usuarios/:id', usuarioController.obterPerfil);
router.put('/usuarios/:id', usuarioController.atualizarPerfil);
router.delete('/usuarios/:id', verificaToken, usuarioController.excluirUsuario );

router.put('/usuarios/:id/avatar', upload.single('avatar'), usuarioController.atualizarAvatar);

module.exports = router;