const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dir = './uploads/avatars';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars');
  },
  filename: (req, file, cb) => {
    const extensao = path.extname(file.originalname);
    cb(null, `${req.params.id}-${Date.now()}${extensao}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});

module.exports = upload;