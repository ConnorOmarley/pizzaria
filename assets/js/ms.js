document.addEventListener('DOMContentLoaded', () => {

    /* ========================= */
    /* DARK MODE — segue preferência do SO */
    /* ========================= */

    const themeToggle = document.getElementById('theme-toggle');

    function getIsDark() {
        const saved = localStorage.getItem('pizzaria-theme');
        if (saved === 'dark') return true;
        if (saved === 'light') return false;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function applyTheme(dark) {
        document.body.classList.toggle('dark', dark);
        const icon = themeToggle ? themeToggle.querySelector('i') : null;
        if (icon) icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        document.documentElement.style.background = '';
    }

    applyTheme(getIsDark());

    // Atualiza se o usuário mudar o tema do SO (apenas se não houver override salvo)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('pizzaria-theme')) applyTheme(e.matches);
    });

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const icon = themeToggle.querySelector('i');
            icon.style.transform = 'rotate(180deg) scale(0)';
            icon.style.opacity = '0';
            setTimeout(() => {
                const isDark = document.body.classList.toggle('dark');
                localStorage.setItem('pizzaria-theme', isDark ? 'dark' : 'light');
                icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
                icon.style.transition = 'none';
                icon.style.transform = 'rotate(-180deg) scale(0)';
                icon.offsetHeight;
                icon.style.transition = 'all 0.3s ease';
                icon.style.transform = 'rotate(0deg) scale(1)';
                icon.style.opacity = '1';
            }, 200);
        });
    }

    /* ========================= */
    /* SLIDER */
    /* ========================= */

    const slides = document.querySelectorAll('.slide');
    const dots   = document.querySelectorAll('.dot');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        if (slides[index]) slides[index].classList.add('active');
        if (dots[index])   dots[index].classList.add('active');
        currentSlide = index;
    }

    if (slides.length > 0) {
        setInterval(() => showSlide((currentSlide + 1) % slides.length), 4000);
        dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
    }

    /* ========================= */
    /* HEADER — esconde ao rolar para baixo */
    /* ========================= */

    const header = document.querySelector('header');
    let lastScroll = window.scrollY;

    window.addEventListener('scroll', () => {
        const current = window.scrollY;
        const diff = current - lastScroll;
        header.style.transform = diff > 0 && current > 80
            ? 'translateY(-100%)'
            : 'translateY(0)';
        lastScroll = current;
    }, { passive: true });

    /* ========================= */
    /* MENU ATIVO AO ROLAR */
    /* ========================= */

    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav_item');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
        });
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === current);
        });
    }, { passive: true });

    /* ========================= */
    /* SIDEBARS — carrinho e login */
    /* ========================= */

    const cartModal  = document.getElementById('cart-modal');
    const loginModal = document.getElementById('login-modal');
    const cartToggle  = document.getElementById('cart-toggle');
    const loginToggle = document.getElementById('login-toggle');

    function openSidebar(el) {
        el.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeSidebar(el) {
        el.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (cartToggle)  cartToggle.addEventListener('click', () => openSidebar(cartModal));
    if (loginToggle) loginToggle.addEventListener('click', () => openSidebar(loginModal));

    document.querySelector('.close-modal')?.addEventListener('click', () => closeSidebar(cartModal));
    document.querySelector('.close-login')?.addEventListener('click', () => closeSidebar(loginModal));

    // Fechar ao clicar no overlay escuro
    cartModal?.addEventListener('click', (e) => {
        if (e.target === cartModal) closeSidebar(cartModal);
    });
    loginModal?.addEventListener('click', (e) => {
        if (e.target === loginModal) closeSidebar(loginModal);
    });

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidebar(cartModal);
            closeSidebar(loginModal);
            productModal?.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    /* ========================= */
    /* MODAL DE CUSTOMIZAÇÃO */
    /* ========================= */

    const productModal          = document.getElementById('product-modal');
    const modalProductTitle     = document.getElementById('modal-product-title');
    const modalProductDesc      = document.getElementById('modal-product-description');
    const removeContainer       = document.getElementById('remove-ingredients-options');
    const addContainer          = document.getElementById('add-ingredients-options');
    const modalPriceValue       = document.getElementById('modal-price-value');
    const addToCartFinalBtn     = document.getElementById('add-to-cart-final-btn');

    const extras = [
        { name: 'Borda Recheada de Catupiry', price: 8.00 },
        { name: 'Borda Recheada de Chocolate', price: 9.00 },
        { name: 'Queijo Extra', price: 6.00 },
        { name: 'Bacon', price: 6.00 },
    ];

    let currentPizza = { name: '', basePrice: 0, totalPrice: 0, remove: [], add: [] };
    let carrinho = [];

    document.querySelectorAll('.btn-comprar-pizza').forEach(btn => {
        btn.addEventListener('click', () => {
            currentPizza = {
                name:       btn.dataset.name,
                basePrice:  parseFloat(btn.dataset.price),
                totalPrice: parseFloat(btn.dataset.price),
                remove: [],
                add: [],
            };

            if (modalProductTitle) modalProductTitle.innerText = currentPizza.name;
            if (modalProductDesc)  modalProductDesc.innerText  = btn.dataset.desc;

            const ings = (btn.dataset.ingredients || '').split(',').map(i => i.trim()).filter(Boolean);
            if (removeContainer) {
                removeContainer.innerHTML = ings.length
                    ? ings.map(ing => `
                        <label class="checkbox-label">
                            <input type="checkbox" class="chk-remove" value="${ing}">
                            Retirar ${ing}
                        </label>`).join('')
                    : '<p style="font-size:.9rem;color:#888">Sem ingredientes removíveis.</p>';
            }

            if (addContainer) {
                addContainer.innerHTML = extras.map(e => `
                    <label class="checkbox-label">
                        <input type="checkbox" class="chk-add" value="${e.name}" data-price="${e.price}">
                        ${e.name} <strong>(+ R$ ${e.price.toFixed(2).replace('.', ',')})</strong>
                    </label>`).join('');
            }

            calcModalPrice();
            if (productModal) productModal.classList.add('active');
        });
    });

    productModal?.addEventListener('change', calcModalPrice);

    function calcModalPrice() {
        let total = currentPizza.basePrice;
        currentPizza.remove = [];
        currentPizza.add    = [];

        document.querySelectorAll('.chk-remove:checked').forEach(c => currentPizza.remove.push(c.value));
        document.querySelectorAll('.chk-add:checked').forEach(c => {
            total += parseFloat(c.dataset.price);
            currentPizza.add.push(c.value);
        });

        currentPizza.totalPrice = total;
        if (modalPriceValue) modalPriceValue.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    document.querySelector('.close-product')?.addEventListener('click', () => {
        productModal?.classList.remove('active');
    });
    productModal?.addEventListener('click', (e) => {
        if (e.target === productModal) productModal.classList.remove('active');
    });

    addToCartFinalBtn?.addEventListener('click', () => {
        carrinho.push({ ...currentPizza });
        productModal?.classList.remove('active');
        renderCarrinho();
        openSidebar(cartModal);
    });

    /* ========================= */
    /* RENDERIZAR CARRINHO */
    /* ========================= */

    function renderCarrinho() {
        const container    = document.getElementById('cart-items');
        const countBadge   = document.getElementById('cart-count');
        const totalDisplay = document.getElementById('cart-total-value');

        if (countBadge) countBadge.innerText = carrinho.length;

        if (!container) return;

        if (carrinho.length === 0) {
            container.innerHTML = '<p class="cart-empty">Seu carrinho está vazio 🍕</p>';
            if (totalDisplay) totalDisplay.innerText = 'R$ 0,00';
            return;
        }

        let totalAcc = 0;
        container.innerHTML = carrinho.map((item, idx) => {
            totalAcc += item.totalPrice;
            const notasSem  = item.remove.length ? `<strong>Sem:</strong> ${item.remove.join(', ')}` : '';
            const notasMais = item.add.length    ? `<strong>Mais:</strong> ${item.add.join(', ')}` : '';
            const notas     = [notasSem, notasMais].filter(Boolean).join(' | ') || 'Tradicional';
            return `
            <div class="cart-item-row">
                <div class="cart-item-info">
                    <h5>${item.name}</h5>
                    <div class="cart-item-details">${notas}</div>
                </div>
                <div style="display:flex;align-items:center;gap:10px">
                    <span class="cart-item-price">R$ ${item.totalPrice.toFixed(2).replace('.', ',')}</span>
                    <button class="btn-remove-item" data-index="${idx}"
                        style="background:transparent;border:none;color:#ef4444;cursor:pointer;font-size:1rem">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>`;
        }).join('');

        if (totalDisplay) totalDisplay.innerText = `R$ ${totalAcc.toFixed(2).replace('.', ',')}`;

        container.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                carrinho.splice(parseInt(btn.dataset.index), 1);
                renderCarrinho();
            });
        });
    }

});
