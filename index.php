<?php
session_start();
require_once 'config/db.php';

$userLoggedIn = isset($_SESSION['user_id']);
$userName     = htmlspecialchars($_SESSION['user_name']  ?? '');
$userEmail    = htmlspecialchars($_SESSION['user_email'] ?? '');

$doces = [];
$salgadas = [];

$result = $conn->query("SELECT * FROM pizzas WHERE available=1 ORDER BY category, id");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        if ($row['category'] === 'doce') $doces[] = $row;
        else $salgadas[] = $row;
    }
}

function renderStars(float $rating): string {
    $out = '';
    for ($i = 1; $i <= 5; $i++) {
        if ($i <= floor($rating)) $out .= '<i class="fa-solid fa-star"></i>';
        elseif (($i - 0.5) <= $rating) $out .= '<i class="fas fa-star-half-alt"></i>';
        else $out .= '<i class="far fa-star"></i>';
    }
    return $out;
}
?>
<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="shortcut icon" type="image/x-icon" href="assets/img/msFavicon.png" />
  <link rel="stylesheet" href="assets/css/styles.css?v=3" />
  <link rel="stylesheet" href="assets/css/auth.css?v=3" />
  <link rel="stylesheet" href="assets/css/payment.css?v=3" />
  <title>Pizzaria Taurus</title>
  <style>
    body { font-family: 'Poppins', sans-serif; }
  </style>
  <!-- Dark é padrão — aplica light antes de renderizar se necessário -->
  <script>
    (function () {
      try {
        if (localStorage.getItem('pizzaria-theme') === 'light') {
          document.documentElement.classList.add('light-pre');
          document.documentElement.style.background = '#fff8eb';
        } else {
          document.documentElement.style.background = '#0b0b12';
        }
      } catch (e) {}
    })();
    window.USER = <?= json_encode([
      'logged_in' => $userLoggedIn,
      'name'      => $_SESSION['user_name']  ?? '',
      'email'     => $_SESSION['user_email'] ?? '',
    ]) ?>;
  </script>
</head>

<body>

  <!-- HEADER -->
  <header>
    <nav id="navbar">
      <a href="#home" class="logo">
        <i class="fas fa-pizza-slice"></i>
        Pizzaria Taurus
      </a>
      <ul id="nav_list">
        <li class="nav_item active" data-section="home"><a href="#home">Home</a></li>
        <li class="nav_item" data-section="menu"><a href="#menu">Cardápio</a></li>
        <li class="nav_item" data-section="avalia"><a href="#avalia">Avaliações</a></li>
      </ul>
      <div id="nav_actions">
        <button id="cart-toggle">
          <i class="fa-solid fa-cart-shopping"></i>
          <span id="cart-count">0</span>
        </button>
        <button id="login-toggle"<?= $userLoggedIn ? ' class="logged-in"' : '' ?>>
          <i class="fa-solid fa-user"></i>
        </button>
        <button id="theme-toggle">
          <i class="fa-solid fa-moon"></i>
        </button>
      </div>
    </nav>
  </header>

  <!-- MAIN -->
  <main id="content">

    <!-- HOME -->
    <section id="home">
      <div class="blob"></div>
      <div id="cta">
        <div class="hero-badge">
          <i class="fa-solid fa-fire"></i> Melhor pizza da cidade
        </div>
        <h1 id="titulo">
          Noites incríveis,<br>
          pizzas <span>inesquecíveis</span>
        </h1>
        <p id="description">
          Massa artesanal, ingredientes selecionados e muito sabor.
          Na Pizzaria Taurus, cada pedido é feito com cuidado — e entregue
          direto na sua porta. 🍕
        </p>
        <div id="cta_buttons">
          <a href="#menu" class="btn-default">
            <i class="fa-solid fa-pizza-slice"></i> Ver Cardápio
          </a>
          <a href="tel:+5581997708693" id="botao_telefone" class="btn-default">
            <i class="fa-solid fa-phone"></i>
            (81) 99770-8693
          </a>
        </div>
        <div id="botao-redes-sociais">
          <a href="https://wa.me/5581997708693" target="_blank">
            <i class="fa-brands fa-whatsapp"></i>
          </a>
          <a href="https://www.instagram.com/fabio_barbosa8p/" target="_blank">
            <i class="fa-brands fa-instagram"></i>
          </a>
        </div>
        <div class="hero-stats">
          <div class="hero-stat">
            <div class="hero-stat-num">500<span>+</span></div>
            <div class="hero-stat-lbl">Clientes</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-num">4.9<span>★</span></div>
            <div class="hero-stat-lbl">Avaliação</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-num">30<span>min</span></div>
            <div class="hero-stat-lbl">Entrega</div>
          </div>
        </div>
      </div>
      <div id="fotoseila">
        <img src="assets/img/pizza.png" alt="Pizza" />
      </div>
      <div class="wave-divider">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,64L80,74.7C160,85,320,107,480,101.3C640,96,800,64,960,58.7C1120,53,1280,75,1360,85.3L1440,96L1440,120L0,120Z"></path>
        </svg>
      </div>
    </section>

    <!-- MENU -->
    <section id="menu">
      <h2>Cardápio</h2>
      <p>Confira nossas deliciosas pizzas!</p>

      <!-- SLIDER -->
      <div class="slider">
        <div class="slide active"><img src="assets/img/pizza1.jpg" alt="Pizza"></div>
        <div class="slide"><img src="assets/img/pizza2.jpg" alt="Pizza"></div>
        <div class="slide"><img src="assets/img/pizza3.jpg" alt="Pizza"></div>
        <div class="dots">
          <span class="dot active"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>

      <!-- DOCES -->
      <h1 class="titulo-doces" data-eyebrow="🍫 Sabor adocicado">Pizzas <span>Doces</span></h1>
      <div id="pratos-doces">
        <?php foreach ($doces as $p):
          $img  = htmlspecialchars($p['image'] ?? 'assets/img/p1.jpg');
          $name = htmlspecialchars($p['name']);
          $desc = htmlspecialchars($p['description']);
          $ing  = htmlspecialchars($p['ingredients'] ?? '');
          $price    = number_format($p['price'], 2, ',', '.');
          $origPrice = $p['original_price'] ? number_format($p['original_price'], 2, ',', '.') : '';
          $disc = (int)$p['discount'];
          $stars = renderStars((float)$p['rating']);
          $reviews = (int)$p['reviews'];
        ?>
        <div class="prato">
          <div class="img-wrap">
            <div class="coracao"><i class="fa-solid fa-heart"></i></div>
            <?php if ($disc > 0): ?><span class="promo">-<?= $disc ?>%</span><?php endif; ?>
            <img src="<?= $img ?>" alt="<?= $name ?>">
            <span class="badge-categoria badge-doce">Doce</span>
          </div>
          <h3 class="titulo-prato"><?= $name ?></h3>
          <span class="descricao-prato"><?= $desc ?></span>
          <div class="prato-estrela"><?= $stars ?><span>(<?= $reviews ?>+)</span></div>
          <div class="preco-prato">
            <div>
              R$ <?= $price ?>
              <?php if ($origPrice): ?><span>R$ <?= $origPrice ?></span><?php endif; ?>
            </div>
            <button class="btn-default btn-comprar-pizza"
              data-name="<?= $name ?>"
              data-price="<?= $p['price'] ?>"
              data-desc="<?= $desc ?>"
              data-ingredients="<?= $ing ?>">
              <i class="fa-solid fa-cart-shopping"></i> Comprar
            </button>
          </div>
        </div>
        <?php endforeach; ?>
      </div>

      <!-- SALGADAS -->
      <h1 class="titulo-salgadas" data-eyebrow="🧀 Sabor clássico">Pizzas <span>Salgadas</span></h1>
      <div id="pratos-salgados">
        <?php foreach ($salgadas as $p):
          $img  = htmlspecialchars($p['image'] ?? 'assets/img/p5.jpg');
          $name = htmlspecialchars($p['name']);
          $desc = htmlspecialchars($p['description']);
          $ing  = htmlspecialchars($p['ingredients'] ?? '');
          $price    = number_format($p['price'], 2, ',', '.');
          $origPrice = $p['original_price'] ? number_format($p['original_price'], 2, ',', '.') : '';
          $disc = (int)$p['discount'];
          $stars = renderStars((float)$p['rating']);
          $reviews = (int)$p['reviews'];
        ?>
        <div class="prato">
          <div class="img-wrap">
            <div class="coracao"><i class="fa-solid fa-heart"></i></div>
            <?php if ($disc > 0): ?><span class="promo">-<?= $disc ?>%</span><?php endif; ?>
            <img src="<?= $img ?>" alt="<?= $name ?>">
            <span class="badge-categoria badge-salgada">Salgada</span>
          </div>
          <h3 class="titulo-prato"><?= $name ?></h3>
          <span class="descricao-prato"><?= $desc ?></span>
          <div class="prato-estrela"><?= $stars ?><span>(<?= $reviews ?>+)</span></div>
          <div class="preco-prato">
            <div>
              R$ <?= $price ?>
              <?php if ($origPrice): ?><span>R$ <?= $origPrice ?></span><?php endif; ?>
            </div>
            <button class="btn-default btn-comprar-pizza"
              data-name="<?= $name ?>"
              data-price="<?= $p['price'] ?>"
              data-desc="<?= $desc ?>"
              data-ingredients="<?= $ing ?>">
              <i class="fa-solid fa-cart-shopping"></i> Comprar
            </button>
          </div>
        </div>
        <?php endforeach; ?>
      </div>
    </section>

    <!-- AVALIAÇÕES -->
    <section id="avalia">
      <h1>Avaliações</h1>
      <div class="avaliacoes-container">
        <div class="avaliacao-card">
          <img src="assets/img/user1.jpg" alt="Marcos Silva">
          <h3>Marcos Silva</h3>
          <div class="prato-estrela">★★★★★</div>
          <p>Melhor pizza da cidade, massa perfeita e entrega rápida.</p>
        </div>
      </div>
    </section>

  </main>

  <!-- WHATSAPP FLUTUANTE -->
  <a href="https://wa.me/5581997708693" class="whatsapp-float" target="_blank">
    <i class="fa-brands fa-whatsapp"></i>
  </a>

  <!-- SIDEBAR CARRINHO -->
  <div id="cart-modal" class="modal-sidebar">
    <div class="sidebar-content">
      <div class="sidebar-header">
        <h2>🛒 Seu Carrinho</h2>
        <button class="close-modal"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div id="cart-items">
        <p class="cart-empty">Seu carrinho está vazio 🍕</p>
      </div>
      <div class="cart-footer">
        <div class="cart-total">
          Total: <span id="cart-total-value">R$ 0,00</span>
        </div>
        <button class="btn-default finalizar-btn">Finalizar Pedido</button>
      </div>
    </div>
  </div>

  <!-- SIDEBAR LOGIN -->
  <div id="login-modal" class="modal-sidebar">
    <div class="sidebar-content">
      <div class="sidebar-header">
        <h2><i class="fa-solid fa-user"></i> Minha Conta</h2>
        <button class="close-login"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <!-- USUÁRIO LOGADO -->
      <div id="user-logged-view" style="<?= $userLoggedIn ? '' : 'display:none' ?>">
        <div class="user-avatar-box">
          <div class="user-avatar-circle">
            <i class="fa-solid fa-user"></i>
          </div>
          <h3 id="user-display-name"><?= $userName ?></h3>
          <p id="user-display-email"><?= $userEmail ?></p>
        </div>
        <div class="auth-divider"></div>
        <button id="logout-btn" class="btn-logout">
          <i class="fa-solid fa-right-from-bracket"></i> Sair da conta
        </button>
      </div>

      <!-- FORMULÁRIOS DE AUTH -->
      <div id="auth-view" style="<?= $userLoggedIn ? 'display:none' : '' ?>">

        <p id="auth-redirect-msg">
          <i class="fa-solid fa-lock"></i> Faça login para adicionar ao carrinho
        </p>

        <!-- ABAS -->
        <div class="auth-tabs">
          <button id="tab-login" class="auth-tab active">Entrar</button>
          <button id="tab-register" class="auth-tab">Cadastrar</button>
        </div>

        <!-- FORM LOGIN -->
        <form id="form-login" novalidate>
          <div id="login-error" class="auth-msg error" style="display:none"></div>
          <div class="auth-field">
            <label for="login-email">E-mail</label>
            <input type="email" id="login-email" placeholder="seu@email.com" autocomplete="email" required>
          </div>
          <div class="auth-field">
            <label for="login-password">Senha</label>
            <div class="input-wrap">
              <input type="password" id="login-password" placeholder="Sua senha" autocomplete="current-password" required>
              <button type="button" class="toggle-pass" data-target="login-password"><i class="fa-solid fa-eye"></i></button>
            </div>
          </div>
          <button type="submit" id="btn-login-submit" class="btn-default btn-auth">
            <i class="fa-solid fa-right-to-bracket"></i> Entrar
          </button>
          <p class="auth-switch">Não tem conta? <a href="#" id="switch-to-register">Cadastre-se</a></p>
        </form>

        <!-- FORM CADASTRO -->
        <form id="form-register" novalidate style="display:none">
          <div id="register-error" class="auth-msg error" style="display:none"></div>
          <div class="auth-field">
            <label for="reg-name">Nome completo</label>
            <input type="text" id="reg-name" placeholder="Seu nome completo" autocomplete="name" required>
          </div>
          <div class="auth-field">
            <label for="reg-email">E-mail</label>
            <input type="email" id="reg-email" placeholder="seu@email.com" autocomplete="email" required>
          </div>
          <div class="auth-field">
            <label for="reg-phone">Telefone <span class="optional">(opcional)</span></label>
            <input type="tel" id="reg-phone" placeholder="(81) 99999-9999" autocomplete="tel">
          </div>
          <div class="auth-field">
            <label for="reg-password">Senha</label>
            <div class="input-wrap">
              <input type="password" id="reg-password" placeholder="Mínimo 6 caracteres" autocomplete="new-password" required>
              <button type="button" class="toggle-pass" data-target="reg-password"><i class="fa-solid fa-eye"></i></button>
            </div>
          </div>
          <div class="auth-field">
            <label for="reg-confirm">Confirmar senha</label>
            <div class="input-wrap">
              <input type="password" id="reg-confirm" placeholder="Repita a senha" autocomplete="new-password" required>
              <button type="button" class="toggle-pass" data-target="reg-confirm"><i class="fa-solid fa-eye"></i></button>
            </div>
          </div>
          <button type="submit" id="btn-register-submit" class="btn-default btn-auth">
            <i class="fa-solid fa-user-plus"></i> Criar conta
          </button>
          <p class="auth-switch">Já tem conta? <a href="#" id="switch-to-login">Entrar</a></p>
        </form>

      </div><!-- /auth-view -->

      <div class="auth-divider"></div>
      <a href="/Pizzaria-1/admin/login.php" class="btn-admin-link">
        <i class="fa-solid fa-lock"></i> Área Administrativa
      </a>

    </div>
  </div>

  <!-- MODAL CUSTOMIZAÇÃO DA PIZZA -->
  <div id="product-modal" class="modal">
    <div class="modal-content product-detail-content">
      <div class="modal-header">
        <h2 id="modal-product-title">Nome da Pizza</h2>
        <button class="close-product"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <p id="modal-product-description" class="descricao-prato"></p>
      <div class="custom-section">
        <h4>Retirar ingredientes (sem custo):</h4>
        <div id="remove-ingredients-options"></div>
      </div>
      <div class="custom-section">
        <h4>Adicionar extras:</h4>
        <div id="add-ingredients-options"></div>
      </div>
      <div class="modal-footer-action">
        <div class="modal-price-preview">
          Preço: <span id="modal-price-value">R$ 0,00</span>
        </div>
        <button id="add-to-cart-final-btn" class="btn-default">
          <i class="fa-solid fa-cart-plus"></i> Adicionar
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL PAGAMENTO -->
  <div id="payment-modal" class="modal">
    <div class="modal-content product-detail-content">
      <div class="modal-header">
        <h2>💳 Finalizar Pedido</h2>
        <button class="close-payment"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <!-- Resumo -->
      <div class="payment-summary">
        <h4>Resumo do Pedido</h4>
        <div id="payment-items-list"></div>
        <div class="payment-total-line">
          <span>Total</span>
          <strong id="payment-total-display">R$ 0,00</strong>
        </div>
      </div>

      <!-- Métodos -->
      <div class="payment-methods">
        <h4>Método de Pagamento</h4>
        <div class="payment-tabs">
          <button class="pay-tab active" data-method="pix">
            <i class="fa-brands fa-pix"></i> PIX
          </button>
          <button class="pay-tab" data-method="debito">
            <i class="fa-solid fa-credit-card"></i> Débito
          </button>
          <button class="pay-tab" data-method="credito">
            <i class="fa-regular fa-credit-card"></i> Crédito
          </button>
        </div>

        <!-- PIX -->
        <div id="pay-view-pix" class="pay-view">
          <div class="pix-container">
            <div class="pix-qr-box">
              <!-- QR Code decorativo SVG -->
              <svg viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
                <!-- Corner TL -->
                <rect x="5" y="5" width="36" height="36" rx="4" fill="#111"/>
                <rect x="11" y="11" width="24" height="24" rx="2" fill="#fff"/>
                <rect x="17" y="17" width="12" height="12" rx="1" fill="#111"/>
                <!-- Corner TR -->
                <rect x="69" y="5" width="36" height="36" rx="4" fill="#111"/>
                <rect x="75" y="11" width="24" height="24" rx="2" fill="#fff"/>
                <rect x="81" y="17" width="12" height="12" rx="1" fill="#111"/>
                <!-- Corner BL -->
                <rect x="5" y="69" width="36" height="36" rx="4" fill="#111"/>
                <rect x="11" y="75" width="24" height="24" rx="2" fill="#fff"/>
                <rect x="17" y="81" width="12" height="12" rx="1" fill="#111"/>
                <!-- Data modules -->
                <rect x="47" y="5"  width="6" height="6" rx="1" fill="#111"/>
                <rect x="57" y="5"  width="6" height="6" rx="1" fill="#111"/>
                <rect x="47" y="15" width="6" height="6" rx="1" fill="#111"/>
                <rect x="57" y="15" width="6" height="6" rx="1" fill="#111"/>
                <rect x="47" y="25" width="6" height="6" rx="1" fill="#111"/>
                <rect x="47" y="35" width="6" height="6" rx="1" fill="#111"/>
                <rect x="57" y="35" width="6" height="6" rx="1" fill="#111"/>
                <rect x="5"  y="47" width="6" height="6" rx="1" fill="#111"/>
                <rect x="15" y="47" width="6" height="6" rx="1" fill="#111"/>
                <rect x="25" y="47" width="6" height="6" rx="1" fill="#111"/>
                <rect x="35" y="47" width="6" height="6" rx="1" fill="#111"/>
                <rect x="5"  y="57" width="6" height="6" rx="1" fill="#111"/>
                <rect x="25" y="57" width="6" height="6" rx="1" fill="#111"/>
                <rect x="35" y="57" width="6" height="6" rx="1" fill="#111"/>
                <rect x="69" y="47" width="6" height="6" rx="1" fill="#111"/>
                <rect x="79" y="47" width="6" height="6" rx="1" fill="#111"/>
                <rect x="99" y="47" width="6" height="6" rx="1" fill="#111"/>
                <rect x="69" y="57" width="6" height="6" rx="1" fill="#111"/>
                <rect x="89" y="57" width="6" height="6" rx="1" fill="#111"/>
                <rect x="47" y="69" width="6" height="6" rx="1" fill="#111"/>
                <rect x="57" y="69" width="6" height="6" rx="1" fill="#111"/>
                <rect x="47" y="79" width="6" height="6" rx="1" fill="#111"/>
                <rect x="67" y="79" width="6" height="6" rx="1" fill="#111"/>
                <rect x="57" y="89" width="6" height="6" rx="1" fill="#111"/>
                <rect x="47" y="99" width="6" height="6" rx="1" fill="#111"/>
                <rect x="67" y="99" width="6" height="6" rx="1" fill="#111"/>
                <!-- PIX center badge -->
                <rect x="43" y="43" width="24" height="24" rx="5" fill="#00bdae"/>
                <text x="55" y="59" text-anchor="middle" font-size="9" fill="white" font-weight="bold" font-family="Arial">PIX</text>
              </svg>
            </div>
            <div class="pix-info">
              <p class="pix-label">Chave PIX (telefone)</p>
              <div class="pix-key-box">
                <span id="pix-key-text">(81) 99770-8693</span>
                <button class="btn-copy-pix" id="btn-copy-pix" title="Copiar chave">
                  <i class="fa-solid fa-copy"></i>
                </button>
              </div>
              <p class="pix-hint">Abra o app do banco, escaneie o QR Code ou cole a chave PIX acima para pagar.</p>
            </div>
          </div>
        </div>

        <!-- DÉBITO -->
        <div id="pay-view-debito" class="pay-view" style="display:none">
          <div class="card-visual">
            <div class="card-chip"></div>
            <div class="card-number-display" id="deb-num-display">•••• •••• •••• ••••</div>
            <div class="card-bottom">
              <span class="card-name-display" id="deb-name-display">NOME DO TITULAR</span>
              <span class="card-expiry-display" id="deb-exp-display">MM/AA</span>
            </div>
          </div>
          <div class="card-inputs">
            <div class="pay-field">
              <label>Número do Cartão</label>
              <input type="text" id="deb-number" placeholder="0000 0000 0000 0000" maxlength="19" inputmode="numeric">
            </div>
            <div class="pay-field">
              <label>Nome do Titular</label>
              <input type="text" id="deb-name" placeholder="Como impresso no cartão">
            </div>
            <div class="pay-field-row">
              <div class="pay-field">
                <label>Validade</label>
                <input type="text" id="deb-expiry" placeholder="MM/AA" maxlength="5" inputmode="numeric">
              </div>
              <div class="pay-field">
                <label>CVV</label>
                <input type="text" id="deb-cvv" placeholder="123" maxlength="3" inputmode="numeric">
              </div>
            </div>
          </div>
        </div>

        <!-- CRÉDITO -->
        <div id="pay-view-credito" class="pay-view" style="display:none">
          <div class="card-visual" style="background:linear-gradient(135deg,#1e3a5f 0%,#0d2137 50%,#051525 100%)">
            <div class="card-chip"></div>
            <div class="card-number-display" id="cred-num-display">•••• •••• •••• ••••</div>
            <div class="card-bottom">
              <span class="card-name-display" id="cred-name-display">NOME DO TITULAR</span>
              <span class="card-expiry-display" id="cred-exp-display">MM/AA</span>
            </div>
          </div>
          <div class="card-inputs">
            <div class="pay-field">
              <label>Número do Cartão</label>
              <input type="text" id="cred-number" placeholder="0000 0000 0000 0000" maxlength="19" inputmode="numeric">
            </div>
            <div class="pay-field">
              <label>Nome do Titular</label>
              <input type="text" id="cred-name" placeholder="Como impresso no cartão">
            </div>
            <div class="pay-field-row">
              <div class="pay-field">
                <label>Validade</label>
                <input type="text" id="cred-expiry" placeholder="MM/AA" maxlength="5" inputmode="numeric">
              </div>
              <div class="pay-field">
                <label>CVV</label>
                <input type="text" id="cred-cvv" placeholder="123" maxlength="3" inputmode="numeric">
              </div>
            </div>
            <div class="pay-field">
              <label>Parcelas</label>
              <select id="cred-installments">
                <option value="1">1× sem juros</option>
                <option value="2">2× sem juros</option>
                <option value="3">3× sem juros</option>
                <option value="4">4× sem juros</option>
                <option value="6">6× sem juros</option>
                <option value="10">10× com juros (1,99%)</option>
                <option value="12">12× com juros (1,99%)</option>
              </select>
            </div>
          </div>
        </div>
      </div><!-- /payment-methods -->

      <div class="payment-footer">
        <button class="btn-confirm" id="btn-confirm-payment">
          <i class="fa-solid fa-lock"></i> Confirmar Pagamento
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL SUCESSO -->
  <div id="success-modal" class="modal">
    <div class="modal-content product-detail-content">
      <div class="success-content">
        <div class="success-icon">🎉</div>
        <h2>Pedido Confirmado!</h2>
        <p>Seu pedido foi recebido e já está sendo preparado com carinho.</p>
        <div class="success-eta">
          <i class="fa-solid fa-clock"></i> Tempo estimado: 30–45 minutos
        </div>
        <button id="btn-close-success" class="btn-default">
          <i class="fa-solid fa-utensils"></i> Voltar ao cardápio
        </button>
      </div>
    </div>
  </div>

  <!-- Script no final para garantir que todos os elementos existam -->
  <script src="assets/js/ms.js"></script>
</body>
</html>
