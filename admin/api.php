<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['admin_id'])) {
    die(json_encode(['success' => false, 'error' => 'Não autenticado']));
}

require_once '../config/db.php';

$action = $_GET['action'] ?? $_POST['action'] ?? '';

try {
    switch ($action) {
        case 'list':
            listPizzas();
            break;
        case 'add':
            addPizza();
            break;
        case 'update':
            updatePizza();
            break;
        case 'delete':
            deletePizza();
            break;
        case 'toggle':
            togglePizza();
            break;
        default:
            echo json_encode(['success' => false, 'error' => 'Ação inválida']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

/* ------- FUNÇÕES ------- */

function listPizzas() {
    global $conn;
    $r = $conn->query("SELECT * FROM pizzas ORDER BY category, id");
    $data = [];
    while ($row = $r->fetch_assoc()) $data[] = $row;
    echo json_encode(['success' => true, 'data' => $data]);
}

function addPizza() {
    global $conn;
    $name         = trim($_POST['name'] ?? '');
    $description  = trim($_POST['description'] ?? '');
    $category     = $_POST['category'] ?? 'salgada';
    $price        = (float)($_POST['price'] ?? 0);
    $orig_price   = $_POST['original_price'] !== '' ? (float)$_POST['original_price'] : null;
    $discount     = (int)($_POST['discount'] ?? 0);
    $ingredients  = trim($_POST['ingredients'] ?? '');
    $rating       = min(5.0, max(1.0, (float)($_POST['rating'] ?? 5.0)));
    $reviews      = (int)($_POST['reviews'] ?? 0);
    $available    = isset($_POST['available']) ? 1 : 0;

    if (!$name || $price <= 0) throw new Exception('Nome e preço são obrigatórios.');
    if (!in_array($category, ['doce','salgada'])) throw new Exception('Categoria inválida.');

    $image = handleImageUpload();

    $s = $conn->prepare("INSERT INTO pizzas (name,description,category,price,original_price,discount,image,ingredients,rating,reviews,available) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
    $s->bind_param('sssddissdii', $name,$description,$category,$price,$orig_price,$discount,$image,$ingredients,$rating,$reviews,$available);
    $s->execute();
    $id = $conn->insert_id;
    $s->close();

    echo json_encode(['success' => true, 'id' => $id, 'message' => 'Pizza adicionada com sucesso!']);
}

function updatePizza() {
    global $conn;
    $id           = (int)($_POST['id'] ?? 0);
    $name         = trim($_POST['name'] ?? '');
    $description  = trim($_POST['description'] ?? '');
    $category     = $_POST['category'] ?? 'salgada';
    $price        = (float)($_POST['price'] ?? 0);
    $orig_price   = ($_POST['original_price'] ?? '') !== '' ? (float)$_POST['original_price'] : null;
    $discount     = (int)($_POST['discount'] ?? 0);
    $ingredients  = trim($_POST['ingredients'] ?? '');
    $rating       = min(5.0, max(1.0, (float)($_POST['rating'] ?? 5.0)));
    $reviews      = (int)($_POST['reviews'] ?? 0);
    $available    = isset($_POST['available']) ? 1 : 0;

    if (!$id || !$name || $price <= 0) throw new Exception('Dados inválidos.');

    // Busca imagem atual
    $r = $conn->query("SELECT image FROM pizzas WHERE id=$id");
    $current = $r->fetch_assoc();
    if (!$current) throw new Exception('Pizza não encontrada.');

    $image = handleImageUpload();
    if (!$image) {
        // Mantém imagem atual se nenhuma nova foi enviada
        $image = $current['image'];
    } else {
        // Remove imagem antiga se era um upload (não um asset padrão)
        if ($current['image'] && strpos($current['image'], 'uploads/') === 0) {
            $oldFile = dirname(__DIR__) . '/' . $current['image'];
            if (file_exists($oldFile)) @unlink($oldFile);
        }
    }

    $s = $conn->prepare("UPDATE pizzas SET name=?,description=?,category=?,price=?,original_price=?,discount=?,image=?,ingredients=?,rating=?,reviews=?,available=? WHERE id=?");
    $s->bind_param('sssddissdiid', $name,$description,$category,$price,$orig_price,$discount,$image,$ingredients,$rating,$reviews,$available,$id);
    $s->execute();
    $s->close();

    echo json_encode(['success' => true, 'message' => 'Pizza atualizada com sucesso!']);
}

function deletePizza() {
    global $conn;
    $body = json_decode(file_get_contents('php://input'), true);
    $id   = (int)($body['id'] ?? 0);
    if (!$id) throw new Exception('ID inválido.');

    // Remove imagem se era um upload
    $r = $conn->query("SELECT image FROM pizzas WHERE id=$id");
    $row = $r->fetch_assoc();
    if ($row && $row['image'] && strpos($row['image'], 'uploads/') === 0) {
        $file = dirname(__DIR__) . '/' . $row['image'];
        if (file_exists($file)) @unlink($file);
    }

    $s = $conn->prepare("DELETE FROM pizzas WHERE id=?");
    $s->bind_param('i', $id);
    $s->execute();
    $s->close();

    echo json_encode(['success' => true, 'message' => 'Pizza excluída.']);
}

function togglePizza() {
    global $conn;
    $body = json_decode(file_get_contents('php://input'), true);
    $id   = (int)($body['id'] ?? 0);
    if (!$id) throw new Exception('ID inválido.');

    $s = $conn->prepare("UPDATE pizzas SET available = NOT available WHERE id=?");
    $s->bind_param('i', $id);
    $s->execute();
    $s->close();

    $r = $conn->query("SELECT available FROM pizzas WHERE id=$id");
    $row = $r->fetch_assoc();

    echo json_encode(['success' => true, 'available' => (bool)$row['available']]);
}

function handleImageUpload(): ?string {
    if (!isset($_FILES['image']) || $_FILES['image']['error'] === UPLOAD_ERR_NO_FILE) return null;
    if ($_FILES['image']['error'] !== UPLOAD_ERR_OK) throw new Exception('Erro no upload da imagem.');

    $maxSize = 5 * 1024 * 1024;
    if ($_FILES['image']['size'] > $maxSize) throw new Exception('Imagem muito grande. Máximo 5 MB.');

    $finfo    = finfo_open(FILEINFO_MIME_TYPE);
    $mime     = finfo_file($finfo, $_FILES['image']['tmp_name']);
    finfo_close($finfo);

    $extMap = ['image/jpeg' => 'jpg', 'image/jpg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    if (!isset($extMap[$mime])) throw new Exception('Tipo de imagem inválido. Use JPG, PNG ou WebP.');

    $filename  = 'pizza_' . time() . '_' . bin2hex(random_bytes(6)) . '.' . $extMap[$mime];
    $uploadDir = dirname(__DIR__) . '/uploads/';

    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
    if (!move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $filename)) {
        throw new Exception('Falha ao salvar a imagem.');
    }

    return 'uploads/' . $filename;
}
