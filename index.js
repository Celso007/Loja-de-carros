const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Conexão com o banco de dados
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
  console.log('Conectado ao MySQL!');
});

// Rota principal
app.get('/', (req, res) => {
  res.send('Servidor rodando, tudo ok!');
});

// Rotas para clientes
app.post('/clientes', (req, res) => {
  const { cpf, nome, sexo, nascimento, telefone, dia, endereco, nacionalidade } = req.body;
  const sql = `INSERT INTO clientes (cpf, nome, sexo, nascimento, telefone, dia, endereco, nacionalidade) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const valores = [cpf, nome, sexo, nascimento, telefone, dia, endereco, nacionalidade];

  connection.query(sql, valores, (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.status(201).json({ mensagem: 'Cliente cadastrado!', id: results.insertId });
  });
});

app.get('/clientes', (req, res) => {
  connection.query('SELECT * FROM clientes', (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

// Rotas para vendedores
app.post('/vendedores', (req, res) => {
  const { matricula, nome, sexo, estado_civil, nacionalidade } = req.body;
  const sql = `INSERT INTO vendedores (matricula, nome, sexo, estado_civil, nacionalidade) VALUES (?, ?, ?, ?, ?)`;
  const valores = [matricula, nome, sexo, estado_civil, nacionalidade];

  connection.query(sql, valores, (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.status(201).json({ mensagem: 'Vendedor cadastrado!', id: results.insertId });
  });
});

app.get('/vendedores', (req, res) => {
  connection.query('SELECT * FROM vendedores', (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

// Rotas para carros
app.post('/carros', (req, res) => {
  const { id, modelo, Ano_De_Fabricacao, preco, estado, modificado } = req.body;
  const sql = `INSERT INTO carros (id, modelo, Ano_De_Fabricacao, preco, estado, modificado) VALUES (?, ?, ?, ?, ?, ?)`;
  const valores = [id, modelo, Ano_De_Fabricacao, preco, estado, modificado];

  connection.query(sql, valores, (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.status(201).json({ mensagem: 'Carro cadastrado!', id: results.insertId });
  });
});

app.get('/carros', (req, res) => {
  connection.query('SELECT * FROM carros', (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

// Rotas para vendas
app.post('/vendas', (req, res) => {
  const { cliente_cpf, carro_id, vendedor_matricula, data_venda, preco_final } = req.body;
  const sql = `INSERT INTO vendas (cliente_cpf, carro_id, vendedor_matricula, data_venda, preco_final) VALUES (?, ?, ?, ?, ?)`;
  const valores = [cliente_cpf, carro_id, vendedor_matricula, data_venda, preco_final];

  connection.query(sql, valores, (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.status(201).json({ mensagem: 'Venda registrada!', id: results.insertId });
  });
});

app.get('/vendas', (req, res) => {
  connection.query('SELECT * FROM vendas', (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

// Relatório de vendas por vendedor
app.get('/relatorios/vendas-por-vendedor', (req, res) => {
  const sql = `
    SELECT v.vendedor_matricula, ve.nome, COUNT(*) as total_vendas, SUM(v.preco_final) as total_receita
    FROM vendas v
    JOIN vendedores ve ON v.vendedor_matricula = ve.matricula
    GROUP BY v.vendedor_matricula, ve.nome
  `;
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Acesse: http://localhost:${port}`);
});
//criando relatorio
function registrarRelatorio(tipo, parametros, usuario) {
  const sql = `
    INSERT INTO relatorios_gerados (tipo_relatorio, parametros_utilizados, usuario)
    VALUES (?, ?, ?)
  `;
  const valores = [tipo, JSON.stringify(parametros), usuario];

  connection.query(sql, valores, (err, results) => {
    if (err) {
      console.error('Erro ao registrar relatório:', err);
      return;
    }
    console.log('Relatório registrado com ID:', results.insertId);
  });
}
registrarRelatorio(
  'Relatório de Vendas por Período',
  { data_inicial: '2024-01-01', data_final: '2024-12-31' },
  'admin@empresa.com'
);