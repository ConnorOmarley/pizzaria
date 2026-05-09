let carrinhoPainel = document.querySelector('.carrinho');
let loginPainel = document.querySelector('.login-form');

document.querySelector('#cart').onclick = () => {
    carrinhoPainel.classList.toggle('active');
    
    loginPainel.classList.remove('active');
};

document.querySelector('#login').onclick = () => {
    loginPainel.classList.toggle('active');
    carrinhoPainel.classList.remove('active');
};

window.onscroll = () => {
    carrinhoPainel.classList.remove('active');
    loginPainel.classList.remove('active');
};