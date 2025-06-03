const express = require('express');
const fs = require('fs');
const app = express();
const arquivo = 'loja_carros';

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
    console.log('Acesse: http://localhost:3000');
});
app.get('/',(req,res)=>res.send('servidor rodando, tudo ok!'));

//criando conexão com bancos de dados
const mysql = require('mysql2');
//localizando banco de dados
const connection = mysql.createConnection({
 host: 'Mysql@localhost:3306',
user: 'root',
password: '1234',
database: 'loja_de_carros'
});

//conectando ao banco de dados
connection.connect(err => {
    if (err) {
      console.error('Erro ao conectar ao MySQL:', err);
      return;
    }
    console.log('Conectado ao MySQL!');
  });
  
  module.exports = connection;
 
  //cadastrar cliente
  const db = require('./db');

function cadastrarCliente(cpf, nome, sexo,nascimento,telefone,dia_da_comnpra,Endereco,nacionalidade) {
    const sql = 'INSERT INTO clientes (cpf, nome, sexo,nascimento,telefone,dia_da_comnpra,Endereco,nacionalidade) VALUES (?, ?, ?)';
    const valores =[cpf, nome, sexo,nascimento,telefone,dia_da_comnpra,Endereco,nacionalidade];
    db.query(sql, valores, (err, results) => {
        if (err) {
          console.error('Erro ao cadastrar cliente:', err);
          return;
        }
        console.log('Cliente cadastrado com sucesso! ID:', results.insertId);
      });
    }


  cadastrarCliente(`863.307.504.61`,`João Gomes`,`M`,`01-02-1995`,`(71)9963-5469`,`Paripe`,`Brasil` );

//cadastrar vendedores
const db = require('./db'); 

function cadastrarVendedores(matricula, nome, sexo,estado_civil,Nacionalidade) {
  const sql = 'INSERT INTO Vendedores(matricula, nome, sexo,estado_civil,Nacionalidade)VALUES (?, ?, ?)';
  const valores =[matricula, nome, sexo,estado_civil,Nacionalidade];
  db.query(sql, valores, (err, results) => {
    if (err) {
      console.error('Erro ao cadastrar Vendedpres:', err);
      return;
    }
    console.log('Vendedores cadastrado com sucesso! ID:', results.insertId);
  });
  }
  cadastrarVendedores(`127221`,'Katarina Anjos',`F`,`solteira`,``);
  cadastrarVendedores(`127222`,'Sabrina Farias',`F`,`solteira`,`Brasil`);

  //cadastrando carros

  const db = require('./db');

  function cadastrandoCarros(id,Modelo,Ano_De_Fabricacao,Preco,estado,modificado){
    const sql = 'INSERT INTO Carros(id,Modelo,Ano_De_Fabricacao,Preco,estado,modificado) VALUES(?,?,?)'
    const valores =[id,Modelo,Ano_De_Fabricacao,Preco,estado,modificado]
    db.query(sql, valores, (err, results) => {
        if (err) {
          console.error('Erro ao cadastrar Vendedpres:', err);
          return;
        }
        console.log('Vendedores cadastrado com sucesso! ID:', results.insertId);
      });
  }
  cadastrandoCarros('01','Impala 67','1967-01-01',150000,'U','N' )