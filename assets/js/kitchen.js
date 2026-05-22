/* ========== KITCHEN LIVE DASHBOARD ========== */
'use strict';

// ── Config ──────────────────────────────────────────────────────────────────

const CUSTOMERS = [
  'Ana Souza', 'Pedro Lima', 'Carla Matos', 'Rafael Gomes',
  'Juliana Costa', 'Bruno Ferreira', 'Letícia Alves', 'Marcos Vieira',
  'Fernanda Rocha', 'Lucas Andrade', 'Isabela Nunes', 'Diego Pinto',
];

const PIZZAS = [
  'Calabresa Especial', 'Margherita', 'Frango c/ Catupiry', 'Portuguesa',
  'Pepperoni', 'Quatro Queijos', 'Brigadeiro', 'Romeu & Julieta',
  'Napolitana', 'Atum', 'Bacon Crocante', 'Muzzarella',
];

const STAGE_ORDER = ['esteira', 'forno', 'pronto'];
const STAGE_LABEL = { esteira: 'Forno', forno: 'Pronto', pronto: 'Entregue' };
const STAGE_ICON  = { esteira: 'fa-fire', forno: 'fa-box-open', pronto: 'fa-check' };

// Urgency thresholds in seconds
const URGENCY = [600, 1200, 1800]; // <10min, <20min, <30min, 30min+

// ── State ────────────────────────────────────────────────────────────────────

let orderSeq = 0;
let orders   = {}; // id → order object
let delivered = 0;
let deliveryTimes = []; // seconds per completed order (for avg)

// ── Helpers ──────────────────────────────────────────────────────────────────

function rand(arr)  { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

function fmtTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function urgencyLevel(elapsed) {
  if (elapsed < URGENCY[0]) return 0;
  if (elapsed < URGENCY[1]) return 1;
  if (elapsed < URGENCY[2]) return 2;
  return 3;
}

const URGENCY_LABELS = ['OK', 'Atenção', 'Atrasado', 'URGENTE'];

function nextOrderNum() {
  orderSeq = (orderSeq % 999) + 1;
  return String(orderSeq).padStart(3, '0');
}

function pick(n, arr) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

// ── Order creation ────────────────────────────────────────────────────────────

function createOrder(opts = {}) {
  const id      = Date.now() + Math.random();
  const numStr  = nextOrderNum();
  const items   = pick(randInt(1, 3), PIZZAS).map(name => ({
    name,
    qty: randInt(1, 2),
  }));
  return {
    id,
    num: numStr,
    customer: opts.customer || rand(CUSTOMERS),
    items,
    stage: opts.stage || 'esteira',
    createdAt: Date.now() - (opts.elapsedSec || 0) * 1000,
  };
}

// ── DOM helpers ───────────────────────────────────────────────────────────────

function getBody(stage) { return document.getElementById(`body-${stage}`); }
function getCount(stage) { return document.getElementById(`count-${stage}`); }

function buildCard(order) {
  const elapsed = Math.floor((Date.now() - order.createdAt) / 1000);
  const urg     = urgencyLevel(elapsed);

  const el = document.createElement('div');
  el.className  = 'k-card';
  el.dataset.id = order.id;
  el.dataset.urgency = urg;

  const nextStage = STAGE_ORDER[STAGE_ORDER.indexOf(order.stage) + 1];
  const btnLabel  = nextStage ? STAGE_LABEL[order.stage] : 'Entregue';
  const btnIcon   = nextStage ? STAGE_ICON[order.stage] : 'fa-check-double';

  el.innerHTML = `
    <div class="k-card-top">
      <div>
        <div class="k-order-num"><span>#</span>${order.num}</div>
      </div>
      <div>
        <div class="k-timer" id="timer-${order.id}">${fmtTime(elapsed)}</div>
        <div class="k-urgency-label" id="ulbl-${order.id}">${URGENCY_LABELS[urg]}</div>
      </div>
    </div>
    <div class="k-customer"><i class="fa-solid fa-user"></i> ${order.customer}</div>
    <div class="k-pizzas">
      ${order.items.map(it => `
        <div class="k-pizza-row">
          <span class="k-pizza-qty">${it.qty}x</span>
          <span class="k-pizza-name">${it.name}</span>
        </div>`).join('')}
    </div>
    <button class="k-action-btn" onclick="advanceOrder('${order.id}')">
      <i class="fa-solid ${btnIcon}"></i> ${btnLabel}
    </button>
  `;

  return el;
}

// ── Render column ─────────────────────────────────────────────────────────────

function renderColumn(stage) {
  const body = getBody(stage);
  const stageOrders = Object.values(orders).filter(o => o.stage === stage);

  // Sort: most urgent first (highest elapsed)
  stageOrders.sort((a, b) => a.createdAt - b.createdAt);

  // Remove cards no longer in this stage
  [...body.querySelectorAll('.k-card')].forEach(el => {
    const id = el.dataset.id;
    if (!orders[id] || orders[id].stage !== stage) el.remove();
  });

  // Remove empty state if present
  const empty = body.querySelector('.k-empty');
  if (stageOrders.length && empty) empty.remove();

  // Add new cards (prepend missing ones in order)
  const existing = new Set([...body.querySelectorAll('.k-card')].map(e => e.dataset.id));
  stageOrders.forEach(order => {
    if (!existing.has(String(order.id))) {
      body.prepend(buildCard(order));
    }
  });

  // Show empty state
  if (!stageOrders.length && !body.querySelector('.k-empty')) {
    body.innerHTML = `<div class="k-empty"><i class="fa-solid fa-inbox"></i> Nenhum pedido</div>`;
  }

  getCount(stage).textContent = stageOrders.length;
}

function renderAll() {
  STAGE_ORDER.forEach(renderColumn);
}

// ── Timer tick (every second) ─────────────────────────────────────────────────

function tick() {
  Object.values(orders).forEach(order => {
    const elapsed = Math.floor((Date.now() - order.createdAt) / 1000);
    const urg     = urgencyLevel(elapsed);

    const timerEl = document.getElementById(`timer-${order.id}`);
    const ulblEl  = document.getElementById(`ulbl-${order.id}`);
    const cardEl  = document.querySelector(`.k-card[data-id="${order.id}"]`);

    if (!timerEl || !cardEl) return;

    timerEl.textContent = fmtTime(elapsed);
    ulblEl.textContent  = URGENCY_LABELS[urg];

    if (parseInt(cardEl.dataset.urgency) !== urg) {
      cardEl.dataset.urgency = urg;
    }
  });

  updateStats();
}

// ── Advance order ─────────────────────────────────────────────────────────────

function advanceOrder(id) {
  const order = orders[id];
  if (!order) return;

  const curIdx   = STAGE_ORDER.indexOf(order.stage);
  const nextStage = STAGE_ORDER[curIdx + 1];

  const cardEl = document.querySelector(`.k-card[data-id="${id}"]`);

  if (!nextStage) {
    // Mark as delivered
    if (cardEl) {
      cardEl.classList.add('leaving');
      setTimeout(() => {
        const elapsed = Math.floor((Date.now() - order.createdAt) / 1000);
        deliveryTimes.push(elapsed);
        delivered++;
        delete orders[id];
        renderAll();
        updateStats();
      }, 280);
    }
    showToast(`Pedido #${order.num} entregue! ✓`, 'success');
    return;
  }

  if (cardEl) {
    cardEl.classList.add('leaving');
    setTimeout(() => {
      order.stage = nextStage;
      renderAll();
    }, 280);
  } else {
    order.stage = nextStage;
    renderAll();
  }

  const label = STAGE_LABEL[STAGE_ORDER[curIdx]];
  showToast(`#${order.num} → ${label}`, 'info');
}

// ── Stats ─────────────────────────────────────────────────────────────────────

function updateStats() {
  const active = Object.keys(orders).length;
  const hoje   = orderSeq;

  document.getElementById('stat-hoje').textContent     = hoje;
  document.getElementById('stat-ativos').textContent   = active;
  document.getElementById('stat-entregues').textContent = delivered;

  if (deliveryTimes.length) {
    const avg = Math.round(deliveryTimes.reduce((a, b) => a + b, 0) / deliveryTimes.length);
    document.getElementById('stat-avg').textContent = fmtTime(avg);
  }
}

// ── Clock ─────────────────────────────────────────────────────────────────────

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('k-clock').textContent = `${h}:${m}:${s}`;
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function showToast(msg, type = 'info') {
  const wrap = document.getElementById('k-toast-wrap');
  const el   = document.createElement('div');
  const icons = { info: 'fa-bell', success: 'fa-circle-check', warn: 'fa-triangle-exclamation' };

  el.className = `k-toast toast-${type}`;
  el.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i> ${msg}`;
  wrap.prepend(el);

  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 280);
  }, 3200);
}

// ── Add random order (button) ─────────────────────────────────────────────────

function addRandomOrder() {
  const order = createOrder();
  orders[order.id] = order;
  renderColumn('esteira');
  updateStats();
  showToast(`Novo pedido #${order.num} — ${order.customer}`, 'info');
}

// ── Demo seed ─────────────────────────────────────────────────────────────────

function initDemoOrders() {
  const seeds = [
    { stage: 'esteira', elapsedSec: 120 },
    { stage: 'esteira', elapsedSec: 480 },
    { stage: 'forno',   elapsedSec: 720 },
    { stage: 'forno',   elapsedSec: 1350 },
    { stage: 'pronto',  elapsedSec: 1650 },
  ];

  seeds.forEach(seed => {
    const o = createOrder(seed);
    orders[o.id] = o;
  });

  renderAll();
  updateStats();
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.getElementById('btn-new-order').addEventListener('click', addRandomOrder);

updateClock();
setInterval(updateClock, 1000);
setInterval(tick, 1000);

initDemoOrders();
