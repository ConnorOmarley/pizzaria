<?php
require_once 'config/db.php';

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
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="shortcut icon" type="image/x-icon" href="assets/img/msFavicon.png" />
  <link rel="stylesheet" href="assets/css/styles.css" />
  <title>Pizzaria Taurus</title>
  <style>
    body { font-family: 'Poppins', sans-serif; }
  </style>
  <!-- Detecta dark mode antes de renderizar para evitar flash -->
  <script>
    (function () {
      try {
        var t = localStorage.getItem('pizzaria-theme');
        var os = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (t === 'dark' || (t === null && os)) {
          document.documentElement.style.background = '#121212';
        }
      } catch (e) {}
    })();
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
        <button id="login-toggle">
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
        <h1 id="titulo">
          Noites tranquilas, pizzas incríveis.
          O <span>SABOR</span> vai até <span>você</span>
        </h1>
        <p id="description">
          Na Pizzaria Taurus, cada pizza é preparada com ingredientes
          selecionados, massa artesanal e muito sabor.
          Um ambiente acolhedor e perfeito para reunir amigos e família
          enquanto aproveita as melhores pizzas da cidade. 🍕
        </p>
        <div id="cta_buttons">
          <a href="#menu" class="btn-default">Ver Cardápio</a>
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
      <h1 class="titulo-doces">Pizzas <span>Doces</span></h1>
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
          <div class="coracao"><i class="fa-solid fa-heart"></i></div>
          <?php if ($disc > 0): ?><span class="promo">-<?= $disc ?>%</span><?php endif; ?>
          <img src="<?= $img ?>" alt="<?= $name ?>">
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
      <h1 class="titulo-salgadas">Pizzas <span>Salgadas</span></h1>
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
          <div class="coracao"><i class="fa-solid fa-heart"></i></div>
          <?php if ($disc > 0): ?><span class="promo">-<?= $disc ?>%</span><?php endif; ?>
          <img src="<?= $img ?>" alt="<?= $name ?>">
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
        <h2>👤 Entrar</h2>
        <button class="close-login"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div style="padding:1rem 0">
        <p style="color:#777;font-size:.9rem;margin-bottom:1.5rem">
          Área do cliente em breve. Para acesso administrativo:
        </p>
        <a href="/Pizzaria-1/admin/login.php"
           style="display:flex;align-items:center;gap:.6rem;background:linear-gradient(135deg,#ffb300,#ffcc33);color:#1a1a1a;padding:12px 18px;border-radius:12px;text-decoration:none;font-weight:700;justify-content:center">
          <i class="fa-solid fa-lock"></i> Painel Administrativo
        </a>
      </div>
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

  <!-- Script no final para garantir que todos os elementos existam -->
  <script src="assets/js/ms.js"></script>
</body>
</html>
