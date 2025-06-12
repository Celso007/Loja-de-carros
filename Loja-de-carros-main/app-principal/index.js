const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const utf8 = require('utf8');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Função para corrigir a codificação dos caracteres
function decodeResults(results) {
  if (!Array.isArray(results)) return results;
  return results.map(row => {
    const decodedRow = {};
    for (const key in row) {
      const value = row[key];
      if (typeof value === 'string') {
        try {
          decodedRow[key] = utf8.decode(Buffer.from(value, 'latin1').toString('binary'));
        } catch (e) {
          decodedRow[key] = value;
        }
      } else {
        decodedRow[key] = value;
      }
    }
    return decodedRow;
  });
}

const connection = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '1234',
  database: process.env.MYSQL_DATABASE || 'loja_de_carros',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  queueLimit: 0
});

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor principal rodando!');
});

// Rota para listar todos os clientes
app.get('/clientes', (req, res) => {
  connection.query('SELECT * FROM clientes', (err, results) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(decodeResults(results));
  });
});

// ... AQUI VOCÊ DEVE ADICIONAR AS OUTRAS ROTAS (POST, PUT, DELETE) ...

app.listen(port, () => {
  console.log(`Servidor principal rodando na porta ${port}`);
});