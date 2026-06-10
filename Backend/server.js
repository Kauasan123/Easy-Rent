const express = require('express');
const cors = require('cors');

const imovelRoutes = require('./routes/imovelRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');

const app = express();

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

app.listen(5000, () => {
  console.log("Servidor rodando lindamente na porta 5000!");
});