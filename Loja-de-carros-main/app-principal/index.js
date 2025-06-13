const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const utf8 = require('utf8');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Função para corrigir a codificação dos caracteres da resposta do banco
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

// Pool de conexões com o banco de dados MySQL
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

// Rota de teste da API principal
app.get('/', (req, res) => {
  res.send('Servidor principal rodando!');
});

// ===================================
//      ROTAS DE CLIENTES
// ===================================

// Rota para LER todos os clientes
app.get('/clientes', async (req, res) => {
    try {
        const [results] = await connection.query('SELECT * FROM clientes');
        res.json(decodeResults(results));
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// Rota para CRIAR um novo cliente
app.post('/clientes', async (req, res) => {
    const { cpf, nome, sexo, nascimento, telefone, endereco } = req.body;
    try {
        await connection.query('INSERT INTO clientes (cpf, nome, sexo, nascimento, telefone, endereco) VALUES (?, ?, ?, ?, ?, ?)', [cpf, nome, sexo, nascimento, telefone, endereco]);
        res.status(201).json({ mensagem: 'Cliente criado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// Rota para ATUALIZAR um cliente
app.put('/clientes/:cpf', async (req, res) => {
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

// Rota para DELETAR um cliente
app.delete('/clientes/:cpf', async (req, res) => {
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


// ===================================
//      ROTAS DE VENDEDORES
// ===================================

// Rota para LER todos os vendedores
app.get('/vendedores', async (req, res) => {
    try {
        const [results] = await connection.query('SELECT * FROM vendedores');
        res.json(decodeResults(results));
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// (As rotas de POST, PUT e DELETE para Vendedores seguiriam a mesma lógica das de Cliente)


// ===================================
//      ROTAS DE CARROS (ESTOQUE)
// ===================================

// Rota para LER todos os carros
app.get('/carros', async (req, res) => {
    try {
        const [results] = await connection.query('SELECT * FROM carros');
        res.json(decodeResults(results));
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// (As rotas de POST, PUT e DELETE para Carros seguiriam a mesma lógica das de Cliente)


// ===================================
//      ROTAS DE VENDAS
// ===================================

// Rota para CRIAR uma nova venda (Receber Pedido de Compra)
app.post('/vendas', async (req, res) => {
    const { cliente_cpf, carro_id, vendedor_matricula, preco_final } = req.body;
    const conn = await connection.getConnection(); 
    try {
        await conn.beginTransaction();
        const [carros] = await conn.query('SELECT disponivel FROM carros WHERE id = ? FOR UPDATE', [carro_id]);
        if (carros.length === 0) throw new Error('Carro não encontrado.');
        if (carros[0].disponivel === 0) throw new Error('Carro não está mais disponível.');

        const sqlVenda = 'INSERT INTO vendas (cliente_cpf, carro_id, vendedor_matricula, preco_final) VALUES (?, ?, ?, ?)';
        const [vendaResult] = await conn.query(sqlVenda, [cliente_cpf, carro_id, vendedor_matricula, preco_final]);
        await conn.query('UPDATE carros SET disponivel = 0 WHERE id = ?', [carro_id]);
        await conn.commit();
        res.status(201).json({ mensagem: 'Venda registrada com sucesso!', id_venda: vendaResult.insertId });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ erro: `Falha ao registrar venda: ${err.message}` });
    } finally {
        conn.release();
    }
});

// Rota para CANCELAR uma venda
app.delete('/vendas/:id', async (req, res) => {
    const { id } = req.params;
    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();
        const [vendas] = await conn.query('SELECT carro_id FROM vendas WHERE id = ?', [id]);
        if (vendas.length === 0) throw new Error('Venda não encontrada.');
        
        const carroId = vendas[0].carro_id;
        await conn.query('DELETE FROM vendas WHERE id = ?', [id]);
        await conn.query('UPDATE carros SET disponivel = 1 WHERE id = ?', [carroId]);
        
        await conn.commit();
        res.status(200).json({ mensagem: 'Venda cancelada com sucesso! Carro voltou para o estoque.' });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ erro: `Falha ao cancelar venda: ${err.message}` });
    } finally {
        conn.release();
    }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor principal rodando na porta ${port}`);
});