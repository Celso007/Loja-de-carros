// controllers/carroController.js
const express = require('express');
const router = express.Router();
const connection = require('../db');

// Listar todos os carros
router.get('/', async (req, res) => {
  try {
    const [results] = await connection.query('SELECT * FROM carros');
    res.json(results);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Criar carro
router.post('/', async (req, res) => {
  const { modelo, marca, ano, preco, disponivel } = req.body;
  try {
    await connection.query(
      'INSERT INTO carros (modelo, marca, ano, preco, disponivel) VALUES (?, ?, ?, ?, ?)',
      [modelo, marca, ano, preco, disponivel]
    );
    res.status(201).json({ mensagem: 'Carro adicionado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar carro
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { modelo, marca, ano, preco, disponivel } = req.body;
  try {
    const [result] = await connection.query(
      'UPDATE carros SET modelo = ?, marca = ?, ano = ?, preco = ?, disponivel = ? WHERE id = ?',
      [modelo, marca, ano, preco, disponivel, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Carro não encontrado.' });
    res.json({ mensagem: 'Carro atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Deletar carro
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [vendas] = await connection.query('SELECT * FROM vendas WHERE carro_id = ?', [id]);
    if (vendas.length > 0) return res.status(400).json({ erro: 'Não é possível deletar carro com vendas.' });

    const [result] = await connection.query('DELETE FROM carros WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Carro não encontrado.' });
    res.json({ mensagem: 'Carro deletado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;