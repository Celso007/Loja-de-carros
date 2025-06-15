-- Garante que o banco de dados será criado com a codificação correta para acentos e 'ç'
CREATE DATABASE IF NOT EXISTS loja_de_carros CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE loja_de_carros;

-- Apaga as tabelas antigas na ordem correta para evitar erros de chave estrangeira
DROP TABLE IF EXISTS `vendas`;
DROP TABLE IF EXISTS `clientes`;
DROP TABLE IF EXISTS `vendedores`;
DROP TABLE IF EXISTS `carros`;

-- Tabela de Vendedores
CREATE TABLE `vendedores` (
  `matricula` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `sexo` enum('M','F') DEFAULT NULL,
  `estado_civil` varchar(20) DEFAULT NULL,
  `nacionalidade` varchar(20) DEFAULT 'Brasil',
  PRIMARY KEY (`matricula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Clientes
CREATE TABLE `clientes` (
  `cpf` varchar(14) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `sexo` char(1) DEFAULT NULL,
  `nascimento` date DEFAULT NULL,
  `telefone` varchar(30) DEFAULT NULL,
  `endereco` varchar(100) DEFAULT NULL,
  `nacionalidade` varchar(20) DEFAULT 'Brasil',
  PRIMARY KEY (`cpf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Carros (que funciona como nosso estoque)
CREATE TABLE `carros` (
  `id` int NOT NULL AUTO_INCREMENT,
  `modelo` varchar(50) NOT NULL,
  `ano_fabricacao` int NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `estado` char(1) NOT NULL COMMENT 'N=Novo, U=Usado',
  `disponivel` tinyint(1) DEFAULT '1' COMMENT '1=Disponível, 0=Vendido',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Vendas, que relaciona um cliente, um vendedor e um carro
CREATE TABLE `vendas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `data_venda` datetime DEFAULT CURRENT_TIMESTAMP,
  `cliente_cpf` varchar(14) NOT NULL,
  `carro_id` int NOT NULL,
  `vendedor_matricula` int NOT NULL,
  `preco_final` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`cliente_cpf`) REFERENCES `clientes` (`cpf`),
  FOREIGN KEY (`carro_id`) REFERENCES `carros` (`id`),
  FOREIGN KEY (`vendedor_matricula`) REFERENCES `vendedores` (`matricula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================= --
--                    INSERINDO DADOS INICIAIS                        --
-- ================================================================= --

-- Inserindo 2 Vendedores
INSERT INTO `vendedores` (`matricula`, `nome`, `sexo`, `estado_civil`) VALUES
(101, 'Beto da Silva', 'M', 'Solteiro'),
(102, 'Carla de Jesus', 'F', 'Casada');

-- Inserindo 5 Clientes de bairros de Salvador
INSERT INTO `clientes` (`cpf`, `nome`, `sexo`, `nascimento`, `telefone`, `endereco`) VALUES
('111.111.111-11', 'Paulo de Magalhães', 'M', '1985-05-20', '71-98888-1111', 'Rua Chile, 1, Centro'),
('222.222.222-22', 'Ivana Medeiros', 'F', '1990-11-15', '71-97777-2222', 'Avenida Oceânica, 1200, Barra'),
('333.333.333-33', 'Rui Almeida', 'M', '1982-01-30', '71-96666-3333', 'Largo do Pelourinho, 10, Pelourinho'),
('444.444.444-44', 'Laís Nogueira', 'F', '1995-07-25', '71-95555-4444', 'Rua das Hortênsias, 500, Pituba'),
('555.555.555-55', 'Antônio "Tonho" Santos', 'M', '1988-03-10', '71-94444-5555', 'Avenida Sete de Setembro, 202, Vitória');

-- Inserindo 10 Carros (Produtos)
INSERT INTO `carros` (`modelo`, `ano_fabricacao`, `preco`, `estado`, `disponivel`) VALUES
('Fiat Strada "Bruta"', 2023, 135000.00, 'N', 1),
('Chevrolet Onix Plus', 2022, 95000.00, 'N', 1),
('Hyundai Creta "Carrão"', 2023, 140000.00, 'N', 1),
('Volkswagen T-Cross', 2021, 120000.00, 'U', 1),
('Jeep Compass "O Chefe"', 2022, 180000.00, 'U', 1),
('Fiat Mobi "Ligeirinho"', 2022, 72000.00, 'U', 1),
('Toyota Hilux "A Lenda"', 2023, 250000.00, 'N', 1),
('Ford Ranger', 2020, 190000.00, 'U', 1),
('Renault Duster', 2023, 125000.00, 'N', 1),
('Honda HR-V', 2022, 155000.00, 'U', 1);

-- Inserindo algumas Vendas para teste
INSERT INTO `vendas` (`cliente_cpf`, `carro_id`, `vendedor_matricula`, `preco_final`) VALUES
('222.222.222-22', 4, 101, 118000.00);
UPDATE `carros` SET `disponivel` = 0 WHERE `id` = 4;

INSERT INTO `vendas` (`cliente_cpf`, `carro_id`, `vendedor_matricula`, `preco_final`) VALUES
('444.444.444-44', 2, 102, 94500.00);
UPDATE `carros` SET `disponivel` = 0 WHERE `id` = 2;

INSERT INTO `vendas` (`cliente_cpf`, `carro_id`, `vendedor_matricula`, `preco_final`) VALUES
('555.555.555-55', 6, 101, 71000.00);
UPDATE `carros` SET `disponivel` = 0 WHERE `id` = 6;