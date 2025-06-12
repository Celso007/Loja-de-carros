const express = require('express');
const mysql = require('mysql2');
const utf8 = require('utf8');

const app = express();
const port = 4000;

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
    res.send('Servidor de relatórios rodando!');
});

// Rota: Relatório de vendas
app.get('/relatorio/vendas', (req, res) => {
  const sql = `
    SELECT v.id, v.data_venda, c.modelo, cli.nome AS cliente, v.preco_final
    FROM vendas v
    JOIN carros c ON v.carro_id = c.id
    JOIN clientes cli ON v.cliente_cpf = cli.cpf
  `;
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).send('Erro no relatório de vendas');
    res.json(decodeResults(results));
  });
});

// ... AQUI VOCÊ DEVE ADICIONAR AS OUTRAS ROTAS DE RELATÓRIO ...

app.listen(port, () => {
  console.log(`Servidor de relatórios rodando na porta ${port}`);
});