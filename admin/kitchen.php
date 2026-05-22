<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit;
}
$adminName = htmlspecialchars($_SESSION['admin_username']);
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kitchen Live — Pizzaria Taurus</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/kitchen.css">
</head>
<body>

  <!-- HEADER -->
  <header class="k-header">
    <div class="k-header-left">
      <a href="panel.php" class="k-back-btn" title="Voltar ao painel">
        <i class="fa-solid fa-chevron-left"></i>
      </a>
      <div class="k-brand">
        <span class="k-brand-icon">🍕</span>
        <div>
          <div class="k-brand-name">Pizzaria Taurus</div>
          <div class="k-brand-sub">Kitchen Live</div>
        </div>
      </div>
    </div>

    <div class="k-stats-bar">
      <div class="k-stat">
        <span class="k-stat-val" id="stat-hoje">0</span>
        <span class="k-stat-lbl">Hoje</span>
      </div>
      <div class="k-stat-divider"></div>
      <div class="k-stat">
        <span class="k-stat-val" id="stat-ativos">0</span>
        <span class="k-stat-lbl">Ativos</span>
      </div>
      <div class="k-stat-divider"></div>
      <div class="k-stat">
        <span class="k-stat-val" id="stat-entregues">0</span>
        <span class="k-stat-lbl">Entregues</span>
      </div>
      <div class="k-stat-divider"></div>
      <div class="k-stat">
        <span class="k-stat-val" id="stat-avg">—</span>
        <span class="k-stat-lbl">Tempo Médio</span>
      </div>
    </div>

    <div class="k-header-right">
      <div class="k-live-badge">
        <span class="k-live-dot"></span>
        LIVE
      </div>
      <div class="k-clock" id="k-clock">00:00:00</div>
      <button class="k-new-order-btn" id="btn-new-order">
        <i class="fa-solid fa-plus"></i>
        <span>Novo Pedido</span>
      </button>
    </div>
  </header>

  <!-- BOARD -->
  <main class="k-board">

    <!-- COLUNA: ESTEIRA -->
    <div class="k-column" id="col-esteira" data-stage="esteira">
      <div class="k-col-header">
        <div class="k-col-title">
          <span class="k-col-dot" style="--col-color:#3b82f6"></span>
          <span>Na Esteira</span>
        </div>
        <span class="k-col-count" id="count-esteira">0</span>
      </div>
      <div class="k-col-body" id="body-esteira"></div>
    </div>

    <!-- COLUNA: FORNO -->
    <div class="k-column" id="col-forno" data-stage="forno">
      <div class="k-col-header">
        <div class="k-col-title">
          <span class="k-col-dot" style="--col-color:#f59e0b"></span>
          <span>No Forno</span>
        </div>
        <span class="k-col-count" id="count-forno">0</span>
      </div>
      <div class="k-col-body" id="body-forno"></div>
    </div>

    <!-- COLUNA: PRONTO -->
    <div class="k-column" id="col-pronto" data-stage="pronto">
      <div class="k-col-header">
        <div class="k-col-title">
          <span class="k-col-dot" style="--col-color:#22c55e"></span>
          <span>Pronto p/ Entrega</span>
        </div>
        <span class="k-col-count" id="count-pronto">0</span>
      </div>
      <div class="k-col-body" id="body-pronto"></div>
    </div>

  </main>

  <!-- TOAST -->
  <div class="k-toast-wrap" id="k-toast-wrap"></div>

  <script src="../assets/js/kitchen.js?v=1"></script>
</body>
</html>
