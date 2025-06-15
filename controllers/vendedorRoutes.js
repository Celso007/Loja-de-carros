// controllers/vendedorController.js
const express = require('express');
const router = express.Router();
const connection = require('../db');

// Listar todos os vendedores
router.get('/', async (req, res) => {
  try {
    const [results] = await connection.query('SELECT * FROM vendedores');
    res.json(results);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Criar vendedor
router.post('/', async (req, res) => {
  const { matricula, nome, telefone } = req.body;
  try {
    await connection.query(
      'INSERT INTO vendedores (matricula, nome, telefone) VALUES (?, ?, ?)',
      [matricula, nome, telefone]
    );
    res.status(201).json({ mensagem: 'Vendedor criado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar vendedor
router.put('/:matricula', async (req, res) => {
  const { matricula } = req.params;
  const { nome, telefone } = req.body;
  try {
    const [result] = await connection.query(
      'UPDATE vendedores SET nome = ?, telefone = ? WHERE matricula = ?',
      [nome, telefone, matricula]
    );
    if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Vendedor não encontrado.' });
    res.json({ mensagem: 'Vendedor atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Deletar vendedor
router.delete('/:matricula', async (req, res) => {
  const { matricula } = req.params;
  try {
    const [vendas] = await connection.query('SELECT * FROM vendas WHERE vendedor_matricula = ?', [matricula]);
    if (vendas.length > 0) return res.status(400).json({ erro: 'Não é possível deletar vendedor com vendas.' });

    const [result] = await connection.query('DELETE FROM vendedores WHERE matricula = ?', [matricula]);
    if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Vendedor não encontrado.' });
    res.json({ mensagem: 'Vendedor deletado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
