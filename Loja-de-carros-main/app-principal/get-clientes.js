const http = require('http');

const url = 'http://localhost:3000/clientes';

http.get(url, res => {
  let data = '';

  // Recebe os dados aos poucos
  res.on('data', chunk => {
    data += chunk;
  });

  // Quando terminar, mostra o resultado
  res.on('end', () => {
    console.log('Resposta da API:');
    try {
      const resultado = JSON.parse(data);
      console.log(resultado);
    } catch (e) {
      console.log(data);
    }
  });
}).on('error', err => {
  console.error('Erro na requisição:', err.message);
});