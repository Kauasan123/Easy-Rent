require('dotenv').config();

const express = require('express');
const cors = require('cors');

const imovelRoutes = require('./routes/imovelRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 

app.use('/api', imovelRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', reservaRoutes);
app.use('/api', avaliacaoRoutes);
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  return res.json({ status: "Backend EasyRent 100% Operacional!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}!`);
});