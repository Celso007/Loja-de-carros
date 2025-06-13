# UC Sistemas Distribuídos e Mobile - Trabalho da A3

Este projeto consiste em uma aplicação que simula a captação de dados de venda de uma rede de lojas, desenvolvida como parte da avaliação A3 da disciplina. O tema escolhido foi uma concessionária de veículos chamada "Loja de Carros".

## 1. Arquitetura da Aplicação

A aplicação foi desenvolvida seguindo o padrão de **Microsserviços**, garantindo a separação de responsabilidades e a escalabilidade do sistema. A arquitetura é composta por três serviços principais, todos executados em containers Docker e orquestrados com Docker Compose:

*   **`app-principal` (Porta 3000):** Serviço de backend responsável por toda a lógica de negócio principal, incluindo o CRUD (Create, Read, Update, Delete) de Clientes, Vendedores, Carros (Estoque) e o gerenciamento de Vendas (registrar e cancelar).
*   **`app-relatorios` (Porta 4000):** Um serviço de backend totalmente independente, cuja única responsabilidade é gerar e expor relatórios estatísticos complexos. Essa separação garante que consultas pesadas não afetem a performance do serviço principal.
*   **`db` (Porta 3306):** Um serviço de banco de dados relacional (MySQL 8.0) que centraliza e persiste todos os dados utilizados pelas duas aplicações.

Toda a comunicação entre os serviços é feita através de uma rede Docker interna.

## 2. Tecnologias Utilizadas

*   **Linguagem:** JavaScript (Node.js v18)
*   **Framework do Servidor:** Express.js
*   **Banco de Dados:** MySQL 8.0
*   **Driver do Banco:** `mysql2` (com suporte a Promises)
*   **Containerização:** Docker e Docker Compose
*   **Bibliotecas Adicionais:**
    *   `body-parser`: Para interpretar o corpo das requisições JSON.
    *   `utf8`: Para tratar e corrigir a codificação de caracteres especiais.
    *   `nodemon`: Para reiniciar automaticamente o servidor durante o desenvolvimento.

## 3. Instruções para Instalação e Execução

Para executar este projeto, é necessário ter o **Docker** e o **Docker Compose** instalados na sua máquina.

1.  **Clone o Repositório**
    ```bash
    git clone https://github.com/Celso007/Loja-de-carros.git
    ```

2.  **Acesse a Pasta do Projeto**
    ```bash
    cd Loja-de-carros/Loja-de-carros-main
    ```

3.  **Inicie a Aplicação com Docker Compose**
    Na pasta raiz do projeto (onde o arquivo `docker-compose.yml` se encontra), execute o seguinte comando:
    ```bash
    docker compose up --build
    ```
    Este comando irá construir as imagens das aplicações, baixar a imagem do MySQL, iniciar os três containers e popular o banco de dados com os dados iniciais. A primeira execução pode demorar alguns minutos.

4.  **Verifique se os Serviços Estão Rodando**
    *   A API Principal estará disponível em: `http://localhost:3000`
    *   A API de Relatórios estará disponível em: `http://localhost:4000`

5.  **Testando os Endpoints**
    Você pode usar uma ferramenta como o Postman, Insomnia ou a extensão "REST Client" do VS Code para testar os endpoints. Um arquivo `testes.http` com exemplos de requisições está incluído no projeto.

6.  **Parar a Aplicação**
    Para parar todos os containers, pressione `Ctrl + C` no terminal onde o `docker compose` está rodando. Para remover os containers e a rede, use o comando:
    ```bash
    docker compose down
    ```
