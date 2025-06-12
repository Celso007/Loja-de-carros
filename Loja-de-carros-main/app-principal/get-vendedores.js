const http = require('http');

http.get('http://localhost:3000/vendedores', res => {
  let data = '';

  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    console.log('Vendedores:');
    try {
      console.log(JSON.parse(data));
    } catch (e) {
      console.log(data);
    }
  });
}).on('error', err => {
  console.error('Erro ao buscar vendedores:', err.message);
});
