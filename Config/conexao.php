<?php
$host = 'localhost';
$db   = 'pizzaria';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Lança erros caso algo dê errado
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Retorna os dados como array associativo
    PDO::ATTR_EMULATE_PREPARES   => false,                  // Desativa a emulação para maior segurança
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
     // Se chegar aqui, conectou com sucesso!
} catch (\PDOException $e) {
     // Se houver erro, ele mata o processo e mostra a mensagem
     throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
?>