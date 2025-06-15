// controllers/clienteController.js
const express = require('express');
const router = express.Router();
const connection = require('../db');
const { decodeResults } = require('../utils');

router.get('/', async (req, res) => {
    try {
        const [results] = await connection.query('SELECT * FROM clientes');
        res.json(decodeResults(results));
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.post('/', async (req, res) => {
    const { cpf, nome, sexo, nascimento, telefone, endereco } = req.body;
    try {
        await connection.query('INSERT INTO clientes (cpf, nome, sexo, nascimento, telefone, endereco) VALUES (?, ?, ?, ?, ?, ?)', [cpf, nome, sexo, nascimento, telefone, endereco]);
        res.status(201).json({ mensagem: 'Cliente criado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.put('/:cpf', async (req, res) => {
    const { cpf } = req.params;
    const { nome, telefone, endereco } = req.body;

    const fields = [];
    const values = [];
    if (nome) { fields.push('nome = ?'); values.push(nome); }
    if (telefone) { fields.push('telefone = ?'); values.push(telefone); }
    if (endereco) { fields.push('endereco = ?'); values.push(endereco); }

    if (fields.length === 0) return res.status(400).json({ mensagem: 'Nenhum campo para atualizar.' });

    const sql = `UPDATE clientes SET ${fields.join(', ')} WHERE cpf = ?`;
    values.push(cpf);

    try {
        const [results] = await connection.query(sql, values);
        if (results.affectedRows === 0) return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
        res.json({ mensagem: 'Cliente atualizado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.delete('/:cpf', async (req, res) => {
    const { cpf } = req.params;
    try {
        const [vendas] = await connection.query('SELECT * FROM vendas WHERE cliente_cpf = ?', [cpf]);
        if (vendas.length > 0) return res.status(400).json({ erro: 'Não é possível deletar cliente com histórico de vendas.' });

        const [results] = await connection.query('DELETE FROM clientes WHERE cpf = ?', [cpf]);
        if (results.affectedRows === 0) return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
        res.json({ mensagem: 'Cliente deletado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;
