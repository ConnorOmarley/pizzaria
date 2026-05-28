<?php
session_start();
require_once '../config/db.php';
header('Content-Type: application/json');

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {

    case 'check':
        echo json_encode([
            'logged_in' => isset($_SESSION['user_id']),
            'user' => isset($_SESSION['user_id']) ? [
                'name'  => $_SESSION['user_name'],
                'email' => $_SESSION['user_email'],
            ] : null,
        ]);
        break;

    case 'register':
        $name     = trim($_POST['name'] ?? '');
        $email    = trim(strtolower($_POST['email'] ?? ''));
        $password = $_POST['password'] ?? '';
        $phone    = trim($_POST['phone'] ?? '');

        if (!$name || !$email || !$password) {
            echo json_encode(['success' => false, 'error' => 'Preencha todos os campos obrigatórios.']);
            exit;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['success' => false, 'error' => 'E-mail inválido.']);
            exit;
        }
        if (mb_strlen($password) < 6) {
            echo json_encode(['success' => false, 'error' => 'A senha deve ter pelo menos 6 caracteres.']);
            exit;
        }

        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            $stmt->close();
            echo json_encode(['success' => false, 'error' => 'Este e-mail já está cadastrado.']);
            exit;
        }
        $stmt->close();

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO users (name, email, password_hash, phone) VALUES (?, ?, ?, ?)");
        $stmt->bind_param('ssss', $name, $email, $hash, $phone);
        if ($stmt->execute()) {
            $userId = $stmt->insert_id;
            session_regenerate_id(true);
            $_SESSION['user_id']    = $userId;
            $_SESSION['user_name']  = $name;
            $_SESSION['user_email'] = $email;
            echo json_encode(['success' => true, 'user' => ['name' => $name, 'email' => $email]]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Erro ao cadastrar. Tente novamente.']);
        }
        $stmt->close();
        break;

    case 'login':
        $email    = trim(strtolower($_POST['email'] ?? ''));
        $password = $_POST['password'] ?? '';

        if (!$email || !$password) {
            echo json_encode(['success' => false, 'error' => 'Preencha e-mail e senha.']);
            exit;
        }

        $stmt = $conn->prepare("SELECT id, name, email, password_hash FROM users WHERE email = ?");
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $res  = $stmt->get_result();
        $user = $res->fetch_assoc();
        $stmt->close();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            echo json_encode(['success' => false, 'error' => 'E-mail ou senha incorretos.']);
            exit;
        }

        session_regenerate_id(true);
        $_SESSION['user_id']    = $user['id'];
        $_SESSION['user_name']  = $user['name'];
        $_SESSION['user_email'] = $user['email'];
        echo json_encode(['success' => true, 'user' => ['name' => $user['name'], 'email' => $user['email']]]);
        break;

    case 'logout':
        session_destroy();
        echo json_encode(['success' => true]);
        break;

    default:
        echo json_encode(['success' => false, 'error' => 'Ação inválida.']);
}
