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

/* ===== INIT ===== */
loadPizzas();
