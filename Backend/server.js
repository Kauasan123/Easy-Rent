const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient(); // No Prisma 6, isso funciona perfeitamente!

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    return res.json({ status: "Conectado ao Banco!", dados: usuarios });
  } catch (error) {
    return res.status(500).json({ status: "Erro no Banco", erro: error.message });
  }
});

app.listen(5000, () => {
  console.log("Servidor rodando na porta 5000!");
});