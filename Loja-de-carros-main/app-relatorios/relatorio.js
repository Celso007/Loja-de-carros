const express = require('express');
const mysql = require('mysql2/promise');
const utf8 = require('utf8');

const app = express();
const port = 4000;

// Função para corrigir a codificação dos caracteres
function decodeResults(results) {
    if (!results || !Array.isArray(results)) return results;
    return results.map(row => {
        const decodedRow = {};
        for (const key in row) {
            const value = row[key];
            if (typeof value === 'string') {
                try {
                    decodedRow[key] = utf8.decode(Buffer.from(value, 'latin1').toString('binary'));
                } catch (e) { decodedRow[key] = value; }
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

app.get('/', (req, res) => res.send('Servidor de relatórios rodando!'));

// --- ROTAS DE RELATÓRIOS ---

// 1. Relatório de produtos mais vendidos
app.get('/relatorios/mais-vendidos', async (req, res) => {
    const sql = `
        SELECT c.modelo, COUNT(v.carro_id) AS total_vendas
        FROM vendas v JOIN carros c ON v.carro_id = c.id
        GROUP BY c.modelo ORDER BY total_vendas DESC;
    `;
    try {
        const [results] = await connection.query(sql);
        res.json(decodeResults(results));
    } catch (err) { res.status(500).json({ erro: err.message }); }
});

// 2. Relatório de produtos por cliente específico
app.get('/relatorios/compras-por-cliente/:cpf', async (req, res) => {
    const { cpf } = req.params;
    const sql = `
        SELECT cli.nome AS cliente, c.modelo, v.data_venda, v.preco_final
        FROM vendas v JOIN carros c ON v.carro_id = c.id
        JOIN clientes cli ON v.cliente_cpf = cli.cpf
        WHERE cli.cpf = ?;
    `;
    try {
        const [results] = await connection.query(sql, [cpf]);
        if (results.length === 0) return res.status(404).json({ mensagem: 'Nenhuma compra encontrada para este cliente.' });
        res.json(decodeResults(results));
    } catch (err) { res.status(500).json({ erro: err.message }); }
});

// 3. Relatório de consumo médio (e total) dos clientes
app.get('/relatorios/consumo-clientes', async (req, res) => {
    const sql = `
        SELECT cli.nome AS cliente, COUNT(v.id) AS total_compras, SUM(v.preco_final) AS total_gasto, AVG(v.preco_final) AS consumo_medio
        FROM vendas v JOIN clientes cli ON v.cliente_cpf = cli.cpf
        GROUP BY cli.nome ORDER BY total_gasto DESC;
    `;
    try {
        const [results] = await connection.query(sql);
        res.json(decodeResults(results));
    } catch (err) { res.status(500).json({ erro: err.message }); }
});

// 4. Relatório de produtos com baixo estoque (vendidos)
app.get('/relatorios/baixo-estoque', async (req, res) => {
    const sql = `SELECT id, modelo, ano_fabricacao, preco FROM carros WHERE disponivel = 0;`;
    try {
        const [results] = await connection.query(sql);
        res.json(decodeResults(results));
    } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.listen(port, () => console.log(`Servidor de relatórios rodando na porta ${port}`));