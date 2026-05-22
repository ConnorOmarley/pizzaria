<?php
session_start();
if (isset($_SESSION['admin_id'])) {
    header('Location: panel.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once '../config/db.php';
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($username && $password) {
        $s = $conn->prepare("SELECT id, username, password_hash FROM admins WHERE username = ?");
        $s->bind_param('s', $username);
        $s->execute();
        $admin = $s->get_result()->fetch_assoc();
        $s->close();

        if ($admin && password_verify($password, $admin['password_hash'])) {
            session_regenerate_id(true);
            $_SESSION['admin_id']       = $admin['id'];
            $_SESSION['admin_username'] = $admin['username'];
            header('Location: panel.php');
            exit;
        }
    }
    $error = 'Usuário ou senha incorretos.';
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin — Pizzaria Taurus</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .login-wrapper {
      width: 100%;
      max-width: 420px;
    }
    .login-logo {
      text-align: center;
      margin-bottom: 2rem;
    }
    .login-logo .icon-wrap {
      width: 72px;
      height: 72px;
      background: linear-gradient(135deg, #f59e0b, #fbbf24);
      border-radius: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin-bottom: .75rem;
      box-shadow: 0 8px 24px rgba(245,158,11,.4);
    }
    .login-logo h1 { color: #f1f5f9; font-size: 1.4rem; font-weight: 700; }
    .login-logo p  { color: #94a3b8; font-size: .85rem; margin-top: .2rem; }
    .card {
      background: rgba(255,255,255,.05);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 24px;
      padding: 2.5rem;
    }
    .card h2 { color: #f1f5f9; font-size: 1.25rem; margin-bottom: 1.75rem; }
    .field { margin-bottom: 1.2rem; }
    .field label { display: block; color: #94a3b8; font-size: .85rem; font-weight: 500; margin-bottom: .5rem; }
    .field-wrap {
      position: relative;
    }
    .field-wrap i {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
      font-size: .95rem;
    }
    .field input {
      width: 100%;
      padding: 13px 14px 13px 40px;
      background: rgba(255,255,255,.07);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 12px;
      color: #f1f5f9;
      font-size: .95rem;
      font-family: 'Poppins', sans-serif;
      outline: none;
      transition: border-color .2s, background .2s;
    }
    .field input::placeholder { color: #64748b; }
    .field input:focus {
      border-color: #f59e0b;
      background: rgba(245,158,11,.07);
    }
    .error-msg {
      background: rgba(239,68,68,.15);
      border: 1px solid rgba(239,68,68,.3);
      color: #fca5a5;
      border-radius: 10px;
      padding: .75rem 1rem;
      font-size: .875rem;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: .5rem;
    }
    .btn-submit {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #f59e0b, #fbbf24);
      border: none;
      border-radius: 12px;
      color: #1a1a1a;
      font-size: 1rem;
      font-weight: 700;
      font-family: 'Poppins', sans-serif;
      cursor: pointer;
      transition: all .2s;
      box-shadow: 0 4px 16px rgba(245,158,11,.35);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: .5rem;
    }
    .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(245,158,11,.45); }
    .back-link {
      display: block;
      text-align: center;
      margin-top: 1.5rem;
      color: #64748b;
      font-size: .875rem;
      text-decoration: none;
      transition: color .2s;
    }
    .back-link:hover { color: #f59e0b; }
    .back-link i { margin-right: .4rem; }
  </style>
</head>
<body>
  <div class="login-wrapper">
    <div class="login-logo">
      <div class="icon-wrap">🍕</div>
      <h1>Pizzaria Taurus</h1>
      <p>Painel Administrativo</p>
    </div>
    <div class="card">
      <h2>Acessar painel</h2>
      <?php if ($error): ?>
      <div class="error-msg"><i class="fa-solid fa-circle-exclamation"></i> <?= htmlspecialchars($error) ?></div>
      <?php endif; ?>
      <form method="POST">
        <div class="field">
          <label>Usuário</label>
          <div class="field-wrap">
            <i class="fa-solid fa-user"></i>
            <input type="text" name="username" placeholder="admin" required autocomplete="username"
              value="<?= htmlspecialchars($_POST['username'] ?? '') ?>">
          </div>
        </div>
        <div class="field">
          <label>Senha</label>
          <div class="field-wrap">
            <i class="fa-solid fa-lock"></i>
            <input type="password" name="password" placeholder="••••••••" required autocomplete="current-password">
          </div>
        </div>
        <button type="submit" class="btn-submit">
          <i class="fa-solid fa-right-to-bracket"></i> Entrar
        </button>
      </form>
    </div>
    <a href="/Pizzaria-1/" class="back-link">
      <i class="fa-solid fa-arrow-left"></i> Voltar ao site
    </a>
  </div>
</body>
</html>
