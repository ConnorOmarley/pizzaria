<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit;
}

require_once '../config/db.php';

$stats = $conn->query("SELECT
    COUNT(*) AS total,
    SUM(category='doce') AS doces,
    SUM(category='salgada') AS salgadas,
    SUM(available=1) AS ativas
FROM pizzas")->fetch_assoc();

$adminName = htmlspecialchars($_SESSION['admin_username']);
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Painel Admin — Pizzaria Taurus</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/admin.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>

  <!-- SIDEBAR -->
  <aside class="admin-sidebar">
    <div class="sidebar-brand">
      <span class="brand-icon">🍕</span>
      <div>
        <div class="brand-name">Pizzaria Taurus</div>
        <div class="brand-sub">Painel Admin</div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <a href="#" class="nav-item active" data-tab="pizzas">
        <i class="fa-solid fa-pizza-slice"></i> Pizzas
      </a>
      <a href="#" class="nav-item" data-tab="contabilidade">
        <i class="fa-solid fa-chart-column"></i> Contabilidade
      </a>
      <a href="/Pizzaria-1/" class="nav-item" target="_blank">
        <i class="fa-solid fa-globe"></i> Ver site
      </a>
    </nav>
    <div class="sidebar-footer">
      <div class="admin-user">
        <div class="user-avatar"><?= strtoupper(substr($adminName, 0, 1)) ?></div>
        <div>
          <div class="user-name"><?= $adminName ?></div>
          <div class="user-role">Administrador</div>
        </div>
      </div>
      <a href="logout.php" class="btn-logout" title="Sair">
        <i class="fa-solid fa-right-from-bracket"></i>
      </a>
    </div>
  </aside>

  <!-- MAIN -->
  <main class="admin-main">

    <!-- ===== ABA PIZZAS ===== -->
    <div id="tab-pizzas">
      <div class="admin-topbar">
        <h1 class="page-title"><i class="fa-solid fa-pizza-slice"></i> Gerenciar Pizzas</h1>
        <button class="btn-add" id="btn-open-add">
          <i class="fa-solid fa-plus"></i> Nova Pizza
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(245,158,11,.15);color:#f59e0b">
            <i class="fa-solid fa-list"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value"><?= $stats['total'] ?></div>
            <div class="stat-label">Total de Pizzas</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(249,115,22,.15);color:#f97316">
            <i class="fa-solid fa-cookie-bite"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value"><?= $stats['doces'] ?></div>
            <div class="stat-label">Doces</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(168,85,247,.15);color:#a855f7">
            <i class="fa-solid fa-pepper-hot"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value"><?= $stats['salgadas'] ?></div>
            <div class="stat-label">Salgadas</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(34,197,94,.15);color:#22c55e">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value"><?= $stats['ativas'] ?></div>
            <div class="stat-label">Disponíveis</div>
          </div>
        </div>
      </div>

      <div class="table-card">
        <div class="table-header">
          <input class="search-input" type="text" id="search-input" placeholder="🔍  Buscar pizza...">
          <div class="filter-btns">
            <button class="filter-btn active" data-filter="all">Todas</button>
            <button class="filter-btn" data-filter="doce">Doces</button>
            <button class="filter-btn" data-filter="salgada">Salgadas</button>
          </div>
        </div>
        <div class="table-wrap">
          <table class="pizza-table" id="pizza-table">
            <thead>
              <tr>
                <th>Imagem</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Desc.</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="pizza-tbody">
              <tr><td colspan="7" class="loading-row"><i class="fa-solid fa-spinner fa-spin"></i> Carregando...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div><!-- /tab-pizzas -->

    <!-- ===== ABA CONTABILIDADE ===== -->
    <div id="tab-contabilidade" style="display:none">
      <div class="admin-topbar">
        <h1 class="page-title"><i class="fa-solid fa-chart-column"></i> Contabilidade</h1>
        <select id="year-select" class="year-select">
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>
      </div>

      <!-- KPIs do mês -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(34,197,94,.15);color:#22c55e">
            <i class="fa-solid fa-money-bill-wave"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value" id="stat-faturamento">—</div>
            <div class="stat-label">Faturamento do Mês</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(59,130,246,.15);color:#3b82f6">
            <i class="fa-solid fa-bag-shopping"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value" id="stat-pedidos">—</div>
            <div class="stat-label">Pedidos no Mês</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(168,85,247,.15);color:#a855f7">
            <i class="fa-solid fa-receipt"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value" id="stat-ticket">—</div>
            <div class="stat-label">Ticket Médio</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(245,158,11,.15);color:#f59e0b">
            <i class="fa-solid fa-arrow-trend-up"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value" id="stat-crescimento">—</div>
            <div class="stat-label">vs. Mês Anterior</div>
          </div>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="charts-grid">
        <div class="chart-card">
          <div class="chart-header">
            <h3><i class="fa-solid fa-chart-bar" style="color:var(--accent)"></i> Faturamento Mensal</h3>
            <span class="chart-year-badge" id="chart-year-label">2026</span>
          </div>
          <div class="chart-wrap">
            <canvas id="chart-revenue"></canvas>
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-header">
            <h3><i class="fa-solid fa-chart-pie" style="color:var(--accent)"></i> Vendas por Tipo</h3>
          </div>
          <div class="chart-wrap chart-wrap-sm">
            <canvas id="chart-category"></canvas>
          </div>
        </div>
      </div>

      <!-- Tabela mensal -->
      <div class="table-card">
        <div class="table-header">
          <h3 style="font-size:.95rem;font-weight:700">Detalhamento Mensal</h3>
        </div>
        <div class="table-wrap">
          <table class="pizza-table">
            <thead>
              <tr>
                <th>Mês</th>
                <th>Pedidos</th>
                <th>Faturamento</th>
                <th>Ticket Médio</th>
                <th>Variação</th>
              </tr>
            </thead>
            <tbody id="month-tbody"></tbody>
          </table>
        </div>
      </div>
    </div><!-- /tab-contabilidade -->

  </main>

  <!-- MODAL ADD / EDIT -->
  <div class="modal-overlay" id="pizza-modal">
    <div class="modal-box">
      <div class="modal-head">
        <h2 id="modal-title">Nova Pizza</h2>
        <button class="modal-close" id="modal-close"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <form id="pizza-form" enctype="multipart/form-data">
        <input type="hidden" name="id" id="field-id">
        <div class="form-grid">
          <div class="form-field span-2">
            <label>Nome *</label>
            <input type="text" name="name" id="field-name" required placeholder="Ex: Pizza de Calabresa">
          </div>
          <div class="form-field span-2">
            <label>Descrição</label>
            <textarea name="description" id="field-description" rows="3" placeholder="Descreva os ingredientes e sabor..."></textarea>
          </div>
          <div class="form-field">
            <label>Categoria *</label>
            <select name="category" id="field-category" required>
              <option value="salgada">Salgada</option>
              <option value="doce">Doce</option>
            </select>
          </div>
          <div class="form-field">
            <label>Preço (R$) *</label>
            <input type="number" name="price" id="field-price" step="0.01" min="0.01" required placeholder="0,00">
          </div>
          <div class="form-field">
            <label>Preço Original (R$)</label>
            <input type="number" name="original_price" id="field-orig" step="0.01" min="0" placeholder="Deixe vazio se não houver">
          </div>
          <div class="form-field">
            <label>Desconto (%)</label>
            <input type="number" name="discount" id="field-disc" min="0" max="99" placeholder="0">
          </div>
          <div class="form-field span-2">
            <label>Ingredientes (separados por vírgula)</label>
            <input type="text" name="ingredients" id="field-ing" placeholder="Ex: Mussarela, Tomate, Manjericão">
          </div>
          <div class="form-field">
            <label>Avaliação (1–5)</label>
            <input type="number" name="rating" id="field-rating" min="1" max="5" step="0.1" value="5.0">
          </div>
          <div class="form-field">
            <label>Nº de Avaliações</label>
            <input type="number" name="reviews" id="field-reviews" min="0" value="0">
          </div>
          <div class="form-field span-2">
            <label>Imagem da Pizza</label>
            <div class="img-upload-area" id="img-upload-area">
              <i class="fa-solid fa-cloud-arrow-up"></i>
              <p>Clique ou arraste uma imagem</p>
              <span>JPG, PNG ou WebP • Máx 5 MB</span>
              <input type="file" name="image" id="field-image" accept="image/jpeg,image/png,image/webp">
            </div>
            <div class="img-preview-wrap" id="img-preview-wrap" style="display:none">
              <img id="img-preview" src="" alt="Preview">
              <button type="button" class="btn-remove-img" id="btn-remove-img">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div id="current-img-info" style="display:none;font-size:.8rem;color:#6b7280;margin-top:.4rem">
              <i class="fa-solid fa-image"></i> Imagem atual mantida (envie nova para substituir)
            </div>
          </div>
          <div class="form-field span-2">
            <label class="toggle-label">
              <input type="checkbox" name="available" id="field-available" checked>
              <span class="toggle-switch"></span>
              Disponível no cardápio
            </label>
          </div>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-cancel" id="btn-cancel">Cancelar</button>
          <button type="submit" class="btn-save" id="btn-save">
            <i class="fa-solid fa-floppy-disk"></i> Salvar
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL DELETE -->
  <div class="modal-overlay" id="delete-modal">
    <div class="modal-box modal-sm">
      <div class="modal-head">
        <h2>Excluir Pizza</h2>
        <button class="modal-close" id="delete-modal-close"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div style="padding:1.5rem 0;text-align:center">
        <div style="font-size:3rem;margin-bottom:1rem">🗑️</div>
        <p>Tem certeza que deseja excluir <strong id="delete-name">esta pizza</strong>?</p>
        <p style="color:#ef4444;font-size:.85rem;margin-top:.5rem">Esta ação não pode ser desfeita.</p>
      </div>
      <div class="modal-actions">
        <button class="btn-cancel" id="btn-delete-cancel">Cancelar</button>
        <button class="btn-danger" id="btn-delete-confirm">
          <i class="fa-solid fa-trash"></i> Excluir
        </button>
      </div>
    </div>
  </div>

  <!-- TOAST -->
  <div class="toast" id="toast"></div>

  <script src="../assets/js/admin.js?v=3"></script>
</body>
</html>
