// controllers/relatorioController.js
const express = require('express');
const router = express.Router();
const connection = require('../db');
const utf8 = require('utf8');

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

// Relatório de vendas por cliente
router.get('/por-cliente', async (req, res) => {
    try {
        const [results] = await connection.query(`
            SELECT c.nome AS cliente, COUNT(v.id) AS total_vendas, SUM(v.preco_final) AS total_gasto
            FROM vendas v
            JOIN clientes c ON v.cliente_cpf = c.cpf
            GROUP BY v.cliente_cpf
            ORDER BY total_gasto DESC
        `);
        res.json(decodeResults(results));
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// Relatório de vendas por vendedor
router.get('/por-vendedor', async (req, res) => {
    try {
        const [results] = await connection.query(`
            SELECT vdd.nome AS vendedor, COUNT(v.id) AS total_vendas, SUM(v.preco_final) AS total_faturado
            FROM vendas v
            JOIN vendedores vdd ON v.vendedor_matricula = vdd.matricula
            GROUP BY v.vendedor_matricula
            ORDER BY total_faturado DESC
        `);
        res.json(decodeResults(results));
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;