# Usa uma imagem oficial do Node.js como base.
# A versão 18 é uma versão LTS (Long Term Support), boa para produção.
FROM node:18-alpine

# Define o diretório de trabalho dentro do container.
# Todos os comandos a seguir serão executados a partir daqui.
WORKDIR /usr/src/app

# Copia os arquivos de definição de pacotes (package.json e package-lock.json).
# O 'COPY' copia do seu computador para dentro do container.
COPY package*.json ./

# Instala as dependências do projeto.
# 'npm ci' é mais rápido e seguro para ambientes de produção do que 'npm install'.
RUN npm ci --only=production

# Copia o resto do código da sua aplicação para o diretório de trabalho no container.
COPY . .

# Expõe a porta 3000 para que o mundo exterior (o Docker) possa se comunicar com a nossa aplicação.
EXPOSE 3000

# Define o comando que será executado quando o container iniciar.
CMD [ "node", "index.js" ]