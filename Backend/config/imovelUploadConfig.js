const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dir = './uploads/imoveis';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/imoveis');
  },
  filename: (req, file, cb) => {
    const extensao = path.extname(file.originalname);
    
    const sufixoUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `imovel-${sufixoUnico}${extensao}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
  }
};

const uploadImovel = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = uploadImovel;