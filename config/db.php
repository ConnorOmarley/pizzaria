<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'pizzaria_taurus');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH'])
           || strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'json') !== false;
    if ($isAjax) {
        header('Content-Type: application/json');
        die(json_encode(['success' => false, 'error' => 'Erro de conexão com o banco de dados']));
    }
    die('<div style="font-family:sans-serif;padding:2rem;text-align:center">
         <h2>⚠️ Banco de dados não encontrado</h2>
         <p>Execute o <a href="/Pizzaria-1/config/setup.php">script de configuração inicial</a> primeiro.</p>
         </div>');
}

$conn->set_charset('utf8mb4');
