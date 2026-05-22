const button = document.getElementById('theme-toggle');

if (button) {
    const icon = button.querySelector('i');

    button.addEventListener('click', () => {

        icon.style.transform = 'rotate(180deg) scale(0)';
        icon.style.opacity = '0';

        setTimeout(() => {

            const isDark = document.body.classList.toggle('dark');

            if (isDark) {
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
            }

            icon.style.transition = 'none';
            icon.style.transform = 'rotate(-180deg) scale(0)';

            icon.offsetHeight;

            icon.style.transition = 'all 0.3s ease';
            icon.style.transform = 'rotate(0deg) scale(1)';
            icon.style.opacity = '1';

        }, 300);
    });
}

/* ========================= */
/* SLIDER FADE */
/* ========================= */

const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

let currentSlide = 0;

function showSlide(index) {

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');

    currentSlide = index;
}

function nextSlide() {
    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    showSlide(currentSlide);
}

setInterval(nextSlide, 3000);

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

/* ========================= */
/* HEADER SCROLL */
/* ========================= */

const header = document.querySelector("header");

let ultimoScroll = window.scrollY;
let opacity = 1;

window.addEventListener("scroll", () => {

    let scrollAtual = window.scrollY;

    if (scrollAtual > ultimoScroll) {
        opacity -= 0.08;
    } else {
        opacity += 0.08;
    }

    if (opacity < 0) opacity = 0;
    if (opacity > 1) opacity = 1;

    header.style.opacity = opacity;
    header.style.transform =
        `translateY(-${(1 - opacity) * 35}px)`;

    ultimoScroll = scrollAtual;
});

/* ========================= */
/* MENU ACTIVE ON SCROLL */
/* ========================= */

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav_item");

window.addEventListener("scroll", () => {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute("id");
        }
    });

    navItems.forEach(item => {
        item.classList.remove("active");

        if (item.dataset.section === currentSection) {
            item.classList.add("active");
        }
    });
});

/* ========================= */
/* MODAIS */
/* ========================= */

const cartToggle = document.getElementById("cart-toggle");
const loginToggle = document.getElementById("login-toggle");

const cartModal = document.getElementById("cart-modal");
const loginModal = document.getElementById("login-modal");

const closeCart = document.querySelector(".close-modal");
const closeLogin = document.querySelector(".close-login");

cartToggle.addEventListener("click", () => {
    cartModal.classList.add("active");
});

loginToggle.addEventListener("click", () => {
    loginModal.classList.add("active");
});

closeCart.addEventListener("click", () => {
    cartModal.classList.remove("active");
});

closeLogin.addEventListener("click", () => {
    loginModal.classList.remove("active");
});

window.addEventListener("click", (e) => {

    if (e.target === cartModal) {
        cartModal.classList.remove("active");
    }

    if (e.target === loginModal) {
        loginModal.classList.remove("active");
    }
});

/* ========================= */
/* CARRINHO */
/* ========================= */

const buyButtons =
    document.querySelectorAll(".preco-prato .btn-default");

const cartItems =
    document.getElementById("cart-items");

const cartTotal =
    document.getElementById("cart-total");

const cartCount =
    document.getElementById("cart-count");

let total = 0;
let quantidadeTotal = 0;

buyButtons.forEach(button => {

    button.addEventListener("click", () => {

        const prato = button.closest(".prato");

        const nome =
            prato.querySelector(".titulo-prato").innerText;

        const precoTexto =
            prato.querySelector(".preco-prato div").innerText;

        const preco =
            parseFloat(
                precoTexto
                    .replace("R$", "")
                    .replace(",", ".")
            );

        const imagem =
            prato.querySelector("img").src;

        const vazio =
            document.querySelector(".cart-empty");

        if (vazio) {
            vazio.remove();
        }

        const itensCarrinho =
            document.querySelectorAll(".cart-item");

        let itemExistente = null;

        itensCarrinho.forEach(item => {
            const titulo =
                item.querySelector("h3").innerText;

            if (titulo === nome) {
                itemExistente = item;
            }
        });

        /* ITEM JÁ EXISTE */
        if (itemExistente) {

            const quantidadeSpan =
                itemExistente.querySelector(".quantidade");

            let quantidade =
                parseInt(quantidadeSpan.innerText);

            quantidade++;

            quantidadeSpan.innerText = quantidade;

            total += preco;
            quantidadeTotal++;

            atualizarCarrinho();

            cartModal.classList.add("active");
            return;
        }

        /* ITEM NOVO */
        const item = document.createElement("div");
        item.classList.add("cart-item");

        item.innerHTML = `
            <img src="${imagem}">

            <div class="cart-info">

                <h3>${nome}</h3>

                <p>R$ ${preco.toFixed(2)}</p>

                <div class="cart-controls">

                    <button class="menos">-</button>

                    <span class="quantidade">1</span>

                    <button class="mais">+</button>

                </div>

            </div>
        `;

        cartItems.appendChild(item);

        const mais = item.querySelector(".mais");
        const menos = item.querySelector(".menos");
        const quantidadeSpan = item.querySelector(".quantidade");

        let quantidade = 1;

        /* MAIS */
        mais.addEventListener("click", () => {

            quantidade++;
            quantidadeSpan.innerText = quantidade;

            total += preco;
            quantidadeTotal++;

            atualizarCarrinho();
        });

        /* MENOS */
        menos.addEventListener("click", () => {

            if (quantidade <= 1) {
                item.remove();
                total -= preco;
                quantidadeTotal--;
                atualizarCarrinho();
                return;
            }

            quantidade--;
            quantidadeSpan.innerText = quantidade;

            total -= preco;
            quantidadeTotal--;

            atualizarCarrinho();
        });

        total += preco;
        quantidadeTotal++;

        atualizarCarrinho();

        cartModal.classList.add("active");
    });
});

/* ========================= */
/* ATUALIZAR CARRINHO */
/* ========================= */

function atualizarCarrinho() {

    if (cartTotal) {
        cartTotal.innerText = `R$ ${total.toFixed(2)}`;
    }

    if (cartCount) {
        cartCount.innerText = quantidadeTotal;
    }
}

document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS GERAIS DO DOM ---
    const cartToggle = document.getElementById('cart-toggle');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.querySelector('.close-modal');

    const loginToggle = document.getElementById('login-toggle');
    const loginModal = document.getElementById('login-modal');
    const closeLogin = document.querySelector('.close-login');

    const themeToggle = document.getElementById('theme-toggle');

    // --- ELEMENTOS DO MODAL DE CUSTOMIZAÇÃO ---
    const productModal = document.getElementById('product-modal');
    const closeProduct = document.querySelector('.close-product');
    const modalProductTitle = document.getElementById('modal-product-title');
    const modalProductDescription = document.getElementById('modal-product-description');
    const removeOptionsContainer = document.getElementById('remove-ingredients-options');
    const addOptionsContainer = document.getElementById('add-ingredients-options');
    const modalPriceValue = document.getElementById('modal-price-value');
    const addToCartFinalBtn = document.getElementById('add-to-cart-final-btn');

    // --- VARIÁVEIS DE CONTROLE DO PRODUTO ATUAL ---
    let currentPizza = { name: '', basePrice: 0, totalPrice: 0, remove: [], add: [] };
    let carrinho = [];

    // Lista de ingredientes extras que podem ser adicionados e a taxa
    const listaExtras = [
        { name: 'Borda Recheada de Catupiry', price: 8.00 },
        { name: 'Borda Recheada de Chocolate', price: 9.00 },
        { name: 'Queijo Extra', price: 6.00 },
        { name: 'Bacon', price: 6.00 }
    ];

    // --- EVENTOS DE CONTROLE DA SIDEBAR DIREITA (CARRINHO / LOGIN) ---
    cartToggle.addEventListener('click', () => cartModal.classList.add('active'));
    closeCart.addEventListener('click', () => cartModal.classList.remove('active'));

    loginToggle.addEventListener('click', () => loginModal.classList.add('active'));
    closeLogin.addEventListener('click', () => loginModal.classList.remove('active'));

    closeProduct.addEventListener('click', () => productModal.classList.remove('active'));

    // Fechar ao clicar nos fundos escuros
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.classList.remove('active');
        if (e.target === loginModal) loginModal.classList.remove('active');
        if (e.target === productModal) productModal.classList.remove('active');
    });

    // --- TEMA ESCURO ---
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const icon = themeToggle.querySelector('i');
        icon.className = document.body.classList.contains('dark') ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    });

    // --- ACIONAMENTO DO BOTÃO COMPRAR (ABRE A CUSTOMIZAÇÃO) ---
    const botoesComprar = document.querySelectorAll('.btn-comprar-pizza');

    botoesComprar.forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.preventDefault();

            // Puxa as informações inseridas nas tags do HTML
            const name = botao.getAttribute('data-name');
            const price = parseFloat(botao.getAttribute('data-price'));
            const desc = botao.getAttribute('data-desc');
            const ingredientsText = botao.getAttribute('data-ingredients') || '';
            const ingredientsArray = ingredientsText.split(',').map(i => i.trim()).filter(i => i !== '');

            // Reinicia o objeto de controle da pizza
            currentPizza = {
                name: name,
                basePrice: price,
                totalPrice: price,
                remove: [],
                add: []
            };

            // Preenche os textos no Modal
            modalProductTitle.innerText = name;
            modalProductDescription.innerText = desc;

            // Renderiza opções para retirar ingredientes existentes
            removeOptionsContainer.innerHTML = '';
            if (ingredientsArray.length > 0) {
                ingredientsArray.forEach(ing => {
                    removeOptionsContainer.innerHTML += `
                        <label class="checkbox-label">
                            <input type="checkbox" class="chk-remove" value="${ing}"> Retirar ${ing}
                        </label>
                    `;
                });
            } else {
                removeOptionsContainer.innerHTML = '<p style="font-size:0.9rem; color:#77;">Nenhum ingrediente base alterável.</p>';
            }

            // Renderiza opções para adicionar extras com taxas adicionais
            addOptionsContainer.innerHTML = '';
            listaExtras.forEach(extra => {
                addOptionsContainer.innerHTML += `
                    <label class="checkbox-label">
                        <input type="checkbox" class="chk-add" value="${extra.name}" data-price="${extra.price}"> 
                        ${extra.name} (+ R$ ${extra.price.toFixed(2)})
                    </label>
                `;
            });

            atualizarPrecoModal();
            productModal.classList.add('active');
        });
    });

    // Ouvir alterações nos checkboxes dentro do modal para recalcular o preço em tempo real
    productModal.addEventListener('change', () => {
        atualizarPrecoModal();
    });

    function atualizarPrecoModal() {
        let precoCalculado = currentPizza.basePrice;

        // Limpa os arrays temporários
        currentPizza.remove = [];
        currentPizza.add = [];

        // Verifica o que o usuário quer retirar
        const checkboxesRemove = document.querySelectorAll('.chk-remove:checked');
        checkboxesRemove.forEach(chk => {
            currentPizza.remove.push(chk.value);
        });

        // Verifica o que ele quer adicionar e soma as taxas
        const checkboxesAdd = document.querySelectorAll('.chk-add:checked');
        checkboxesAdd.forEach(chk => {
            const valorExtra = parseFloat(chk.getAttribute('data-price'));
            precoCalculado += valorExtra;
            currentPizza.add.push(chk.value);
        });

        currentPizza.totalPrice = precoCalculado;
        modalPriceValue.innerText = `R$ ${precoCalculado.toFixed(2)}`;
    }

    // --- ENVIAR DA TELA DE CUSTOMIZAÇÃO PARA O CARRINHO ---
    addToCartFinalBtn.addEventListener('click', () => {
        // Salva a cópia estruturada da pizza customizada no array do carrinho
        carrinho.push({ ...currentPizza });

        productModal.classList.remove('active');
        atualizarInterfaceCarrinho();

        // Abre automaticamente o carrinho da direita para feedback visual
        cartModal.classList.add('active');
    });

    // --- CONSTRUÇÃO E RENDERS DO CARRINHO ---
    function atualizarInterfaceCarrinho() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartCountBadge = document.getElementById('cart-count');
        const cartTotalValue = document.getElementById('cart-total-value');

        // Atualiza a bolinha de quantidade total no cabeçalho
        cartCountBadge.innerText = carrinho.length;

        if (carrinho.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty">Seu carrinho está vazio 🍕</p>';
            cartTotalValue.innerText = 'R$ 0,00';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let totalAcumulado = 0;

        carrinho.forEach((item, index) => {
            totalAcumulado += item.totalPrice;

            // Monta as strings de observações baseados nas escolhas
            let extrasTxt = item.add.length > 0 ? `<strong>Mais:</strong> ${item.add.join(', ')}` : '';
            let removesTxt = item.remove.length > 0 ? `<strong>Sem:</strong> ${item.remove.join(', ')}` : '';

            let detalhesItem = [removesTxt, extrasTxt].filter(t => t !== '').join(' | ');

            cartItemsContainer.innerHTML += `
                <div class="cart-item-row">
                    <div class="cart-item-info">
                        <h5>${item.name}</h5>
                        <div class="cart-item-details">${detalhesItem ? detalhesItem : 'Tradicional'}</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span class="cart-item-price">R$ ${item.totalPrice.toFixed(2)}</span>
                        <button class="btn-remove-item" data-index="${index}" style="background:transparent; border:none; color:red; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            `;
        });

        cartTotalValue.innerText = `R$ ${totalAcumulado.toFixed(2)}`;

        // Vincula a função de deletar item específico ao ícone de lixeira
        const botoesDeletar = document.querySelectorAll('.btn-remove-item');
        botoesDeletar.forEach(btn => {
            btn.addEventListener('click', () => {
                const indexParaRemover = parseInt(btn.getAttribute('data-index'));
                carrinho.splice(indexParaRemover, 1);
                atualizarInterfaceCarrinho();
            });
        });
    }

    // --- CONTROLE SLIDER ---
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    setInterval(() => {
        if (slides.length > 0) {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
    }, 5000);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
});