/* ===========================
   ADMIN PANEL JS — Pizzaria Taurus
   =========================== */

const API = 'api.php';
let pizzas   = [];
let editId   = null;
let deleteId = null;

/* ===== TOAST ===== */
function toast(msg, type = 'success') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = `toast ${type} show`;
    setTimeout(() => el.classList.remove('show'), 3500);
}

/* ===== MODAL HELPERS ===== */
function openModal(id)  { document.getElementById(id).classList.add('active');    document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('active'); document.body.style.overflow = ''; }

/* ===== CARREGAR PIZZAS ===== */
async function loadPizzas() {
    const tbody = document.getElementById('pizza-tbody');
    try {
        const res  = await fetch(`${API}?action=list`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        pizzas = json.data;
        renderTable(pizzas);
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="7" class="loading-row" style="color:#ef4444"><i class="fa-solid fa-circle-exclamation"></i> Erro: ${e.message}</td></tr>`;
    }
}

function renderTable(list) {
    const tbody = document.getElementById('pizza-tbody');
    if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading-row">Nenhuma pizza encontrada.</td></tr>';
        return;
    }
    tbody.innerHTML = list.map(p => {
        const imgSrc = p.image ? `../${p.image}` : '../assets/img/p1.jpg';
        const catBadge = p.category === 'doce'
            ? '<span class="badge badge-doce">Doce</span>'
            : '<span class="badge badge-salgada">Salgada</span>';
        const statusBtn = p.available == 1
            ? `<button class="status-badge status-on" data-id="${p.id}" data-action="toggle"><i class="fa-solid fa-circle-check"></i> Ativo</button>`
            : `<button class="status-badge status-off" data-id="${p.id}" data-action="toggle"><i class="fa-solid fa-circle-xmark"></i> Inativo</button>`;
        const priceStr = parseFloat(p.price).toFixed(2).replace('.', ',');

        return `<tr>
            <td><img class="thumb" src="${imgSrc}" alt="${esc(p.name)}" onerror="this.src='../assets/img/p1.jpg'"></td>
            <td><strong>${esc(p.name)}</strong></td>
            <td>${catBadge}</td>
            <td><strong>R$ ${priceStr}</strong></td>
            <td>${p.discount > 0 ? `<span style="color:#f59e0b;font-weight:600">-${p.discount}%</span>` : '—'}</td>
            <td>${statusBtn}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon btn-icon-edit" data-id="${p.id}" data-action="edit" title="Editar">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-icon btn-icon-del" data-id="${p.id}" data-action="delete" title="Excluir">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function esc(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
}

/* ===== FILTRO E BUSCA ===== */
document.getElementById('search-input')?.addEventListener('input', filterTable);
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterTable();
    });
});

function filterTable() {
    const q    = (document.getElementById('search-input')?.value || '').toLowerCase();
    const cat  = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    const list = pizzas.filter(p =>
        (cat === 'all' || p.category === cat) &&
        (!q || p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q))
    );
    renderTable(list);
}

/* ===== DELEGAÇÃO DE EVENTOS NA TABELA ===== */
document.getElementById('pizza-tbody')?.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id     = parseInt(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === 'toggle') await toggleAvailability(id);
    if (action === 'edit')   openEditModal(id);
    if (action === 'delete') openDeleteModal(id);
});

/* ===== TOGGLE DISPONIBILIDADE ===== */
async function toggleAvailability(id) {
    try {
        const res  = await fetch(`${API}?action=toggle`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        toast(json.available ? 'Pizza ativada!' : 'Pizza desativada!');
        await loadPizzas();
    } catch (e) { toast(e.message, 'error'); }
}

/* ===== ABRIR MODAL ADD ===== */
document.getElementById('btn-open-add')?.addEventListener('click', () => {
    editId = null;
    document.getElementById('modal-title').textContent = 'Nova Pizza';
    document.getElementById('pizza-form').reset();
    document.getElementById('field-id').value = '';
    document.getElementById('field-available').checked = true;
    resetImagePreview(false);
    document.getElementById('current-img-info').style.display = 'none';
    openModal('pizza-modal');
});

/* ===== ABRIR MODAL EDIT ===== */
function openEditModal(id) {
    const p = pizzas.find(x => x.id == id);
    if (!p) return;
    editId = id;

    document.getElementById('modal-title').textContent = 'Editar Pizza';
    document.getElementById('field-id').value           = p.id;
    document.getElementById('field-name').value         = p.name;
    document.getElementById('field-description').value  = p.description || '';
    document.getElementById('field-category').value     = p.category;
    document.getElementById('field-price').value        = p.price;
    document.getElementById('field-orig').value         = p.original_price || '';
    document.getElementById('field-disc').value         = p.discount || 0;
    document.getElementById('field-ing').value          = p.ingredients || '';
    document.getElementById('field-rating').value       = p.rating;
    document.getElementById('field-reviews').value      = p.reviews || 0;
    document.getElementById('field-available').checked  = p.available == 1;

    resetImagePreview(false);
    if (p.image) {
        document.getElementById('current-img-info').style.display = 'block';
    } else {
        document.getElementById('current-img-info').style.display = 'none';
    }

    openModal('pizza-modal');
}

/* ===== SUBMIT FORM ===== */
document.getElementById('pizza-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-save');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';

    const fd     = new FormData(e.target);
    const isEdit = !!document.getElementById('field-id').value;
    const action = isEdit ? 'update' : 'add';

    try {
        const res  = await fetch(`${API}?action=${action}`, { method: 'POST', body: fd });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        toast(json.message || 'Salvo com sucesso!');
        closeModal('pizza-modal');
        await loadPizzas();
    } catch (e) {
        toast(e.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Salvar';
    }
});

/* ===== MODAL DELETE ===== */
function openDeleteModal(id) {
    deleteId = id;
    const p  = pizzas.find(x => x.id == id);
    document.getElementById('delete-name').textContent = p ? p.name : 'esta pizza';
    openModal('delete-modal');
}

document.getElementById('btn-delete-confirm')?.addEventListener('click', async () => {
    if (!deleteId) return;
    try {
        const res  = await fetch(`${API}?action=delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: deleteId })
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        toast('Pizza excluída.');
        closeModal('delete-modal');
        await loadPizzas();
    } catch (e) { toast(e.message, 'error'); }
});

/* ===== FECHAR MODAIS ===== */
document.getElementById('modal-close')?.addEventListener('click',         () => closeModal('pizza-modal'));
document.getElementById('btn-cancel')?.addEventListener('click',          () => closeModal('pizza-modal'));
document.getElementById('delete-modal-close')?.addEventListener('click',  () => closeModal('delete-modal'));
document.getElementById('btn-delete-cancel')?.addEventListener('click',   () => closeModal('delete-modal'));

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay.id);
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal('pizza-modal');
        closeModal('delete-modal');
    }
});

/* ===== PREVIEW DE IMAGEM ===== */
document.getElementById('field-image')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        document.getElementById('img-preview').src = ev.target.result;
        document.getElementById('img-preview-wrap').style.display = 'block';
        document.getElementById('img-upload-area').style.display  = 'none';
        document.getElementById('current-img-info').style.display = 'none';
    };
    reader.readAsDataURL(file);
});

document.getElementById('btn-remove-img')?.addEventListener('click', () => {
    document.getElementById('field-image').value = '';
    resetImagePreview(editId !== null);
});

function resetImagePreview(showCurrent) {
    document.getElementById('img-preview-wrap').style.display = 'none';
    document.getElementById('img-upload-area').style.display  = 'block';
    document.getElementById('current-img-info').style.display = showCurrent ? 'block' : 'none';
}

/* ===== TABS ===== */
let contabilidadeInited = false;

document.querySelectorAll('.nav-item[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;

        document.querySelectorAll('.nav-item[data-tab]').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        document.getElementById('tab-pizzas').style.display          = tab === 'pizzas'        ? '' : 'none';
        document.getElementById('tab-contabilidade').style.display   = tab === 'contabilidade' ? '' : 'none';

        if (tab === 'contabilidade') {
            try { initContabilidade(); } catch(err) { console.error('Contabilidade:', err); }
        }
    });
});

/* ===== CONTABILIDADE ===== */
const MONTH_SHORT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const MONTH_FULL  = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

const REVENUE = {
    2026: [5100, 4820, 5340, 5890, 6240,    0,    0,    0,    0,    0,    0,    0],
    2025: [4250, 3920, 4610, 5080, 5740, 6180, 6720, 6490, 5880, 5420, 6080, 8150],
    2024: [3820, 3650, 4120, 4780, 5250, 5690, 6080, 5870, 5320, 4960, 5580, 7450],
};
const ORDERS = {
    2026: [102,   96,  107,  118,  125,    0,    0,    0,    0,    0,    0,    0],
    2025: [  85,  78,   92,  102,  115,  124,  134,  130,  118,  108,  122,  163],
    2024: [  76,  73,   82,   96,  105,  114,  122,  117,  106,   99,  112,  149],
};

let revenueChart  = null;
let categoryChart = null;
const NOW_MONTH = new Date().getMonth();
const NOW_YEAR  = new Date().getFullYear();

function fmtBRL(v) {
    return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function initContabilidade() {
    const year = parseInt(document.getElementById('year-select').value);
    const rev  = REVENUE[year] || REVENUE[2025];
    const ord  = ORDERS[year]  || ORDERS[2025];

    document.getElementById('chart-year-label').textContent = year;

    // KPIs — usa o mês atual se o ano for o corrente, senão usa Dezembro
    const kpiMonth = (year === NOW_YEAR) ? NOW_MONTH : 11;
    const prevM    = kpiMonth > 0 ? kpiMonth - 1 : 11;

    const mRev    = rev[kpiMonth] || 0;
    const mOrd    = ord[kpiMonth] || 0;
    const mTicket = mOrd > 0 ? Math.round(mRev / mOrd) : 0;
    const pRev    = rev[prevM] || 0;
    const growth  = pRev > 0 ? ((mRev - pRev) / pRev * 100).toFixed(1) : '0';

    document.getElementById('stat-faturamento').textContent  = fmtBRL(mRev);
    document.getElementById('stat-pedidos').textContent      = mOrd;
    document.getElementById('stat-ticket').textContent       = fmtBRL(mTicket);
    const growEl = document.getElementById('stat-crescimento');
    growEl.textContent = (growth >= 0 ? '+' : '') + growth + '%';
    growEl.style.color = growth >= 0 ? '#22c55e' : '#ef4444';

    // Bar chart — faturamento mensal
    const revenueCtx = document.getElementById('chart-revenue').getContext('2d');
    if (revenueChart) revenueChart.destroy();
    revenueChart = new Chart(revenueCtx, {
        type: 'bar',
        data: {
            labels: MONTH_SHORT,
            datasets: [{
                label: 'Faturamento',
                data: rev,
                backgroundColor: rev.map((v, i) =>
                    i === kpiMonth && year === NOW_YEAR
                        ? 'rgba(245,158,11,1)'
                        : v > 0 ? 'rgba(245,158,11,0.4)' : 'rgba(0,0,0,0.05)'
                ),
                borderRadius: 7,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: { label: ctx => ' ' + fmtBRL(ctx.raw) }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,.05)' },
                    ticks: { callback: v => 'R$ ' + (v/1000).toFixed(1) + 'k', font: { size: 11 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });

    // Donut chart — categoria
    const doces    = pizzas.filter(p => p.category === 'doce').length    || 4;
    const salgadas = pizzas.filter(p => p.category === 'salgada').length || 4;
    const catCtx   = document.getElementById('chart-category').getContext('2d');
    if (categoryChart) categoryChart.destroy();
    categoryChart = new Chart(catCtx, {
        type: 'doughnut',
        data: {
            labels: ['Doces', 'Salgadas'],
            datasets: [{
                data: [doces, salgadas],
                backgroundColor: ['#f97316', '#a855f7'],
                borderWidth: 0,
                hoverOffset: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
                legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 16 } },
                tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}` } }
            }
        }
    });

    // Tabela detalhada
    const tbody = document.getElementById('month-tbody');
    if (!tbody) return;
    tbody.innerHTML = rev.map((revenue, i) => {
        if (revenue === 0 && year === NOW_YEAR && i > NOW_MONTH) {
            return `<tr style="opacity:.35">
                <td>${MONTH_FULL[i]}</td>
                <td>—</td><td>—</td><td>—</td><td>—</td>
            </tr>`;
        }
        const orders = ord[i];
        const ticket = orders > 0 ? Math.round(revenue / orders) : 0;
        const prev   = i > 0 ? rev[i - 1] : null;
        let variacao = '—';
        if (prev && prev > 0) {
            const g = ((revenue - prev) / prev * 100).toFixed(1);
            const cor   = g >= 0 ? '#22c55e' : '#ef4444';
            const arrow = g >= 0 ? '↑' : '↓';
            variacao = `<span style="color:${cor};font-weight:600">${arrow} ${Math.abs(g)}%</span>`;
        }
        const isCurrent = i === kpiMonth && year === NOW_YEAR;
        return `<tr class="${isCurrent ? 'month-highlight' : ''}">
            <td><strong>${MONTH_FULL[i]}</strong>${isCurrent ? ' <span class="badge badge-doce">Atual</span>' : ''}</td>
            <td>${orders}</td>
            <td><strong>${fmtBRL(revenue)}</strong></td>
            <td>${fmtBRL(ticket)}</td>
            <td>${variacao}</td>
        </tr>`;
    }).join('');
}

document.getElementById('year-select')?.addEventListener('change', initContabilidade);

/* ===== INIT ===== */
loadPizzas();
