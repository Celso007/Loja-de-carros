const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 4000; // Porta diferente do sistema principal

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'loja_de_carros'
});

connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL no serviço de relatórios!');
});

// Rota: Relatório de carros
app.get('/relatorio/carros', (req, res) => {
  const sql = 'SELECT * FROM carros';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar carros:', err);
      res.status(500).send('Erro no relatório de carros');
      return;
    }
    res.json(results);
  });
});

// Rota: Relatório de vendas
app.get('/relatorio/vendas', (req, res) => {
  const sql = `
    SELECT v.id, v.data_venda, c.modelo, cli.nome AS cliente, v.preco_final
    FROM vendas v
    JOIN carros c ON v.id_carro = c.id
    JOIN clientes cli ON v.cpf_cliente = cli.cpf
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erro no relatório de vendas:', err);
      res.status(500).send('Erro no relatório de vendas');
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Servidor de relatórios rodando em: http://localhost:${port}`);
});
