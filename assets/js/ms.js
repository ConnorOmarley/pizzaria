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

    if (cartToggle) cartToggle.addEventListener('click', () => openSidebar(cartModal));

    if (loginToggle) loginToggle.addEventListener('click', () => {
        // Esconde o aviso de redirecionamento ao abrir manualmente
        const msg = document.getElementById('auth-redirect-msg');
        if (msg) msg.style.display = 'none';
        openSidebar(loginModal);
    });

    document.querySelector('.close-modal')?.addEventListener('click', () => closeSidebar(cartModal));
    document.querySelector('.close-login')?.addEventListener('click', () => closeSidebar(loginModal));

    cartModal?.addEventListener('click', (e) => {
        if (e.target === cartModal) closeSidebar(cartModal);
    });
    loginModal?.addEventListener('click', (e) => {
        if (e.target === loginModal) closeSidebar(loginModal);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidebar(cartModal);
            closeSidebar(loginModal);
            productModal?.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    /* ========================= */
    /* AUTH — login, cadastro, logout */
    /* ========================= */

    let pendingPizza = null;

    const authView       = document.getElementById('auth-view');
    const userLoggedView = document.getElementById('user-logged-view');

    function showLoginTab() {
        document.getElementById('tab-login')?.classList.add('active');
        document.getElementById('tab-register')?.classList.remove('active');
        const fl = document.getElementById('form-login');
        const fr = document.getElementById('form-register');
        if (fl) fl.style.display = '';
        if (fr) fr.style.display = 'none';
        const err = document.getElementById('login-error');
        if (err) err.style.display = 'none';
    }

    function showRegisterTab() {
        document.getElementById('tab-register')?.classList.add('active');
        document.getElementById('tab-login')?.classList.remove('active');
        const fl = document.getElementById('form-login');
        const fr = document.getElementById('form-register');
        if (fr) fr.style.display = '';
        if (fl) fl.style.display = 'none';
        const err = document.getElementById('register-error');
        if (err) err.style.display = 'none';
    }

    document.getElementById('tab-login')?.addEventListener('click', showLoginTab);
    document.getElementById('tab-register')?.addEventListener('click', showRegisterTab);
    document.getElementById('switch-to-register')?.addEventListener('click', (e) => { e.preventDefault(); showRegisterTab(); });
    document.getElementById('switch-to-login')?.addEventListener('click', (e) => { e.preventDefault(); showLoginTab(); });

    // Mostrar/esconder senha
    document.querySelectorAll('.toggle-pass').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.target);
            if (!input) return;
            const show = input.type === 'password';
            input.type = show ? 'text' : 'password';
            btn.querySelector('i').className = show ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        });
    });

    function showAuthError(elId, msg) {
        const el = document.getElementById(elId);
        if (el) { el.textContent = msg; el.style.display = 'block'; }
    }

    function onLoginSuccess(user) {
        window.USER = { logged_in: true, name: user.name, email: user.email };

        // Atualiza view logado
        const nameEl  = document.getElementById('user-display-name');
        const emailEl = document.getElementById('user-display-email');
        if (nameEl)  nameEl.textContent  = user.name;
        if (emailEl) emailEl.textContent = user.email;

        if (authView)       authView.style.display       = 'none';
        if (userLoggedView) userLoggedView.style.display = 'block';

        // Marca o botão do navbar
        document.getElementById('login-toggle')?.classList.add('logged-in');

        // Fecha sidebar e abre o modal da pizza pendente
        setTimeout(() => {
            closeSidebar(loginModal);
            if (pendingPizza) {
                const pp = pendingPizza;
                pendingPizza = null;
                openProductModal(pp);
            }
        }, 400);
    }

    // FORMULÁRIO DE LOGIN
    document.getElementById('form-login')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email    = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const btn      = document.getElementById('btn-login-submit');

        document.getElementById('login-error').style.display = 'none';

        if (!email || !password) {
            showAuthError('login-error', 'Preencha e-mail e senha.');
            return;
        }

        btn.disabled = true;
        btn.style.opacity = '.7';

        try {
            const fd = new FormData();
            fd.append('action', 'login');
            fd.append('email', email);
            fd.append('password', password);

            const res  = await fetch('/Pizzaria-1/auth/api.php', { method: 'POST', body: fd });
            const data = await res.json();

            if (data.success) {
                onLoginSuccess(data.user);
            } else {
                showAuthError('login-error', data.error || 'Erro ao fazer login.');
            }
        } catch {
            showAuthError('login-error', 'Erro de conexão. Tente novamente.');
        } finally {
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    });

    // FORMULÁRIO DE CADASTRO
    document.getElementById('form-register')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name     = document.getElementById('reg-name').value.trim();
        const email    = document.getElementById('reg-email').value.trim();
        const phone    = document.getElementById('reg-phone').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirm  = document.getElementById('reg-confirm').value;
        const btn      = document.getElementById('btn-register-submit');

        document.getElementById('register-error').style.display = 'none';

        if (!name || !email || !password) {
            showAuthError('register-error', 'Preencha todos os campos obrigatórios.');
            return;
        }
        if (password !== confirm) {
            showAuthError('register-error', 'As senhas não coincidem.');
            return;
        }
        if (password.length < 6) {
            showAuthError('register-error', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        btn.disabled = true;
        btn.style.opacity = '.7';

        try {
            const fd = new FormData();
            fd.append('action', 'register');
            fd.append('name', name);
            fd.append('email', email);
            fd.append('phone', phone);
            fd.append('password', password);

            const res  = await fetch('/Pizzaria-1/auth/api.php', { method: 'POST', body: fd });
            const data = await res.json();

            if (data.success) {
                onLoginSuccess(data.user);
            } else {
                showAuthError('register-error', data.error || 'Erro ao cadastrar.');
            }
        } catch {
            showAuthError('register-error', 'Erro de conexão. Tente novamente.');
        } finally {
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    });

    // LOGOUT
    document.getElementById('logout-btn')?.addEventListener('click', async () => {
        const fd = new FormData();
        fd.append('action', 'logout');
        await fetch('/Pizzaria-1/auth/api.php', { method: 'POST', body: fd });
        window.location.reload();
    });

    /* ========================= */
    /* MODAL DE CUSTOMIZAÇÃO */
    /* ========================= */

    const productModal      = document.getElementById('product-modal');
    const modalProductTitle = document.getElementById('modal-product-title');
    const modalProductDesc  = document.getElementById('modal-product-description');
    const removeContainer   = document.getElementById('remove-ingredients-options');
    const addContainer      = document.getElementById('add-ingredients-options');
    const modalPriceValue   = document.getElementById('modal-price-value');
    const addToCartFinalBtn = document.getElementById('add-to-cart-final-btn');

    const extras = [
        { name: 'Borda Recheada de Catupiry', price: 8.00 },
        { name: 'Borda Recheada de Chocolate', price: 9.00 },
        { name: 'Queijo Extra', price: 6.00 },
        { name: 'Bacon', price: 6.00 },
    ];

    let currentPizza = { name: '', basePrice: 0, totalPrice: 0, remove: [], add: [] };
    let carrinho = [];

    function openProductModal(pizza) {
        currentPizza = {
            name:      pizza.name,
            basePrice: pizza.basePrice,
            totalPrice: pizza.basePrice,
            remove: [],
            add: [],
        };

        if (modalProductTitle) modalProductTitle.innerText = pizza.name;
        if (modalProductDesc)  modalProductDesc.innerText  = pizza.desc || '';

        const ings = (pizza.ingredients || '').split(',').map(i => i.trim()).filter(Boolean);
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
    }

    document.querySelectorAll('.btn-comprar-pizza').forEach(btn => {
        btn.addEventListener('click', () => {
            const pizza = {
                name:        btn.dataset.name,
                basePrice:   parseFloat(btn.dataset.price),
                desc:        btn.dataset.desc,
                ingredients: btn.dataset.ingredients,
            };

            // Exige login antes de adicionar ao carrinho
            if (!window.USER?.logged_in) {
                pendingPizza = pizza;
                const msg = document.getElementById('auth-redirect-msg');
                if (msg) msg.style.display = 'block';
                showLoginTab();
                openSidebar(loginModal);
                return;
            }

            openProductModal(pizza);
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
