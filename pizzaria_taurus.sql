-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 23/05/2026 às 02:00
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `pizzaria_taurus`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `admins`
--

INSERT INTO `admins` (`id`, `username`, `password_hash`, `created_at`) VALUES
(1, 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '2026-05-22 18:17:45');

-- --------------------------------------------------------

--
-- Estrutura para tabela `pizzas`
--

CREATE TABLE `pizzas` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `category` enum('doce','salgada') NOT NULL DEFAULT 'salgada',
  `price` decimal(10,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `discount` int(11) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `ingredients` text DEFAULT NULL,
  `rating` decimal(3,1) DEFAULT 5.0,
  `reviews` int(11) DEFAULT 0,
  `available` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `pizzas`
--

INSERT INTO `pizzas` (`id`, `name`, `description`, `category`, `price`, `original_price`, `discount`, `image`, `ingredients`, `rating`, `reviews`, `available`, `created_at`) VALUES
(1, 'Pizza de Chocolate com Morango', 'Uma deliciosa combinação de chocolate derretido e morangos frescos, perfeita para os amantes de doces.', 'doce', 37.90, 54.90, 30, 'assets/img/p1.jpg', 'Chocolate, Morangos frescos', 5.0, 100, 1, '2026-05-22 18:17:45'),
(2, 'Pizza de Banana com Nutella', 'Uma deliciosa combinação de banana e nutella, perfeita para os amantes de doces.', 'doce', 49.90, 69.90, 28, 'assets/img/p2.jpg', 'Banana, Nutella', 5.0, 100, 1, '2026-05-22 18:17:45'),
(3, 'Chocolate com Biscoito', 'Uma deliciosa combinação de chocolate e biscoito picado, perfeita para os amantes de doces.', 'doce', 29.90, 44.90, 33, 'assets/img/p3.jpg', 'Chocolate, Biscoito picado', 5.0, 50, 1, '2026-05-22 18:17:45'),
(4, 'Pizza de Banana com Doce de Leite', 'Uma deliciosa combinação de banana e doce de leite, perfeita para os amantes de doces.', 'doce', 49.90, 74.90, 33, 'assets/img/p4.jpg', 'Banana, Doce de leite', 5.0, 90, 1, '2026-05-22 18:17:45'),
(5, 'Pizza de Marguerita', 'Uma clássica combinação de molho de tomate artesanal, queijo muçarela derretido, tomate fresco e folhas de manjericão.', 'salgada', 49.90, 69.90, 29, 'assets/img/p5.jpg', 'Molho de tomate, Queijo muçarela, Tomate fresco, Manjericão', 5.0, 60, 1, '2026-05-22 18:17:45'),
(6, 'Pizza de Calabresa', 'Uma deliciosa combinação de calabresa fatiada, queijo muçarela derretido e cebola fresca.', 'salgada', 49.90, 69.90, 29, 'assets/img/p6.jpg', 'Calabresa fatiada, Queijo muçarela, Cebola fresca', 5.0, 60, 1, '2026-05-22 18:17:45'),
(7, 'Pizza de Frango com Catupiry', 'Uma combinação irresistível de frango desfiado, Catupiry cremoso e queijo muçarela.', 'salgada', 42.90, 64.90, 34, 'assets/img/p7.jpg', 'Frango desfiado, Catupiry cremoso, Queijo muçarela', 4.5, 200, 1, '2026-05-22 18:17:45'),
(8, 'Pizza de Stroganoff', 'Uma saborosa combinação de strogonoff cremoso, queijo muçarela derretido e batata palha crocante.', 'salgada', 46.90, 69.90, 33, 'assets/img/p8.jpg', 'Strogonoff cremoso, Queijo muçarela, Batata palha', 4.5, 150, 1, '2026-05-22 18:17:45');

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `phone`, `created_at`) VALUES
(1, 'Cliente Demo', 'cliente@exemplo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '', '2026-05-22 22:24:58');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Índices de tabela `pizzas`
--
ALTER TABLE `pizzas`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `pizzas`
--
ALTER TABLE `pizzas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
