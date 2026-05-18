/* INICIO VARIAVEIS DOS PAINEIS */
let carrinhoPainel = document.querySelector('.carrinho');
let loginPainel = document.querySelector('.login-form');
let menuPainel = document.querySelector('.menu-site');
/* FIM VARIAVEIS DOS PAINEIS */

/* INICIO BOTÃO CARRINHO */
document.querySelector('#cart').onclick = () => {

    carrinhoPainel.classList.toggle('active');

    loginPainel.classList.remove('active');
    menuPainel.classList.remove('active');

};
/* FIM BOTÃO CARRINHO */

window.onscroll = () => {
    carrinho.classList.remove('active')
    login.classList.remove('active')
}


/* INICIO BOTÃO LOGIN */
document.querySelector('#login').onclick = () => {

    loginPainel.classList.toggle('active');

    carrinhoPainel.classList.remove('active');
    menuPainel.classList.remove('active');

};
/* FIM BOTÃO LOGIN */

/* INICIO MENU MOBILE */
document.querySelector('#menu').onclick = () => {

    menuPainel.classList.toggle('active');

    carrinhoPainel.classList.remove('active');
    loginPainel.classList.remove('active');

};
/* FIM MENU MOBILE */

/* INICIO FECHAR PAINEIS AO ROLAR */
window.onscroll = () => {

    carrinhoPainel.classList.remove('active');
    loginPainel.classList.remove('active');
    menuPainel.classList.remove('active');

};
/* FIM FECHAR PAINEIS AO ROLAR */

/* INICIO SWIPER SLIDER */
const swiper = new Swiper(".home-slider", {

    loop: true,
    centeredSlides: true,
    grabCursor: true,
    slidesPerView: 1,

    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },

    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },

});
/* FIM SWIPER SLIDER */

document.addEventListener('DOMContentLoaded', function () {
    var swiper = new Swiper(".menu-slider", {
        grabCursor: true,
        loop: true,
        autoHeight: true,
        spaceBetween: 20,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });
});