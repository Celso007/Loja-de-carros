# Usa a mesma imagem base do Node.js
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de definição de pacotes
COPY package*.json ./

# Instala as dependências de produção
RUN npm ci --only=production

# Copia o resto do código da aplicação
COPY . .

# Expõe a porta 4000, que é a porta deste serviço
EXPOSE 4000

# Define o comando para iniciar este serviço
CMD [ "node", "relatorio.js" ]