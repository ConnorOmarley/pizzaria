<?php
$conn = new mysqli('localhost', 'root', '');
if ($conn->connect_error) die('Conexão falhou: ' . $conn->connect_error);

$conn->query("CREATE DATABASE IF NOT EXISTS pizzaria_taurus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
$conn->select_db('pizzaria_taurus');

$conn->query("CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB");

$conn->query("CREATE TABLE IF NOT EXISTS pizzas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category ENUM('doce','salgada') NOT NULL DEFAULT 'salgada',
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2) DEFAULT NULL,
    discount INT DEFAULT 0,
    image VARCHAR(255) DEFAULT NULL,
    ingredients TEXT DEFAULT NULL,
    rating DECIMAL(3,1) DEFAULT 5.0,
    reviews INT DEFAULT 0,
    available TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB");

// Cria admin padrão
$r = $conn->query("SELECT id FROM admins WHERE username='admin'");
if ($r->num_rows === 0) {
    $hash = password_hash('admin123', PASSWORD_DEFAULT);
    $s = $conn->prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)");
    $u = 'admin';
    $s->bind_param('ss', $u, $hash);
    $s->execute();
    $s->close();
}

// Seed de pizzas iniciais
$r = $conn->query("SELECT COUNT(*) AS c FROM pizzas");
$cnt = $r->fetch_assoc()['c'];

if ($cnt == 0) {
    $pizzas = [
        ['Pizza de Chocolate com Morango','Uma deliciosa combinação de chocolate derretido e morangos frescos, perfeita para os amantes de doces.','doce',37.90,54.90,30,'assets/img/p1.jpg','Chocolate, Morangos frescos',5.0,100],
        ['Pizza de Banana com Nutella','Uma deliciosa combinação de banana e nutella, perfeita para os amantes de doces.','doce',49.90,69.90,28,'assets/img/p2.jpg','Banana, Nutella',5.0,100],
        ['Chocolate com Biscoito','Uma deliciosa combinação de chocolate e biscoito picado, perfeita para os amantes de doces.','doce',29.90,44.90,33,'assets/img/p3.jpg','Chocolate, Biscoito picado',5.0,50],
        ['Pizza de Banana com Doce de Leite','Uma deliciosa combinação de banana e doce de leite, perfeita para os amantes de doces.','doce',49.90,74.90,33,'assets/img/p4.jpg','Banana, Doce de leite',5.0,90],
        ['Pizza de Marguerita','Uma clássica combinação de molho de tomate artesanal, queijo muçarela derretido, tomate fresco e folhas de manjericão.','salgada',49.90,69.90,29,'assets/img/p5.jpg','Molho de tomate, Queijo muçarela, Tomate fresco, Manjericão',5.0,60],
        ['Pizza de Calabresa','Uma deliciosa combinação de calabresa fatiada, queijo muçarela derretido e cebola fresca.','salgada',49.90,69.90,29,'assets/img/p6.jpg','Calabresa fatiada, Queijo muçarela, Cebola fresca',5.0,60],
        ['Pizza de Frango com Catupiry','Uma combinação irresistível de frango desfiado, Catupiry cremoso e queijo muçarela.','salgada',42.90,64.90,34,'assets/img/p7.jpg','Frango desfiado, Catupiry cremoso, Queijo muçarela',4.5,200],
        ['Pizza de Stroganoff','Uma saborosa combinação de strogonoff cremoso, queijo muçarela derretido e batata palha crocante.','salgada',46.90,69.90,33,'assets/img/p8.jpg','Strogonoff cremoso, Queijo muçarela, Batata palha',4.5,150],
    ];

    $s = $conn->prepare("INSERT INTO pizzas (name,description,category,price,original_price,discount,image,ingredients,rating,reviews) VALUES (?,?,?,?,?,?,?,?,?,?)");
    foreach ($pizzas as $p) {
        $s->bind_param('sssddissdi', $p[0],$p[1],$p[2],$p[3],$p[4],$p[5],$p[6],$p[7],$p[8],$p[9]);
        $s->execute();
    }
    $s->close();
}

$conn->close();
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Setup — Pizzaria Taurus</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',sans-serif;background:#f3f4f6;display:flex;align-items:center;justify-content:center;min-height:100vh}
.card{background:white;padding:2.5rem 3rem;border-radius:20px;box-shadow:0 8px 30px rgba(0,0,0,.1);text-align:center;max-width:480px;width:90%}
.icon{font-size:3rem;margin-bottom:1rem}
h2{color:#111827;margin-bottom:.5rem}
p{color:#6b7280;margin-bottom:1rem}
.badge{background:#dcfce7;color:#166534;padding:.4rem 1rem;border-radius:20px;font-size:.85rem;font-weight:600;display:inline-block;margin-bottom:1.5rem}
.cred{background:#f9fafb;border:1px solid #e5e7eb;padding:1rem 1.5rem;border-radius:12px;margin:1rem 0;text-align:left}
.cred p{color:#374151;margin:.4rem 0;font-size:.95rem}
.cred strong{color:#111827}
.btns{display:flex;gap:1rem;justify-content:center;margin-top:1.5rem;flex-wrap:wrap}
.btn{background:linear-gradient(135deg,#ffb300,#ffcc33);color:#1a1a1a;padding:.75rem 1.5rem;border-radius:12px;text-decoration:none;font-weight:700;font-size:.95rem;transition:all .2s}
.btn:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(255,179,0,.4)}
</style>
</head>
<body>
<div class="card">
  <div class="icon">🍕</div>
  <div class="badge">✅ Setup concluído com sucesso</div>
  <h2>Pizzaria Taurus configurada!</h2>
  <p>Banco de dados, tabelas e dados iniciais criados.</p>
  <div class="cred">
    <p><strong>Credenciais do administrador:</strong></p>
    <p>Usuário: <strong>admin</strong></p>
    <p>Senha: <strong>admin123</strong></p>
  </div>
  <div class="btns">
    <a class="btn" href="/Pizzaria-1/">🍕 Ver o site</a>
    <a class="btn" href="/Pizzaria-1/admin/login.php">🔐 Acessar admin</a>
  </div>
</div>
</body>
</html>
