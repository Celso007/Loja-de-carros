// index.js (arquivo principal)
const express = require('express');
const bodyParser = require('body-parser');
const clienteRoutes = require('./controllers/clienteController');
const carroRoutes = require('./controllers/carroController');
const relatorioRoutes = require('./controllers/relatorioController');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Rota de teste da API principal
app.get('/', (req, res) => {
  res.send('Servidor principal rodando!');
});

// Uso das rotas
app.use('/clientes', clienteRoutes);
app.use('/carros', carroRoutes);
app.use('/relatorios', relatorioRoutes);
app.use('/vendedores', vededoresRoutes);
// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor principal rodando na porta ${port}`);
});