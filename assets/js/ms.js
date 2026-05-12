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

const swiper = new Swiper(".homer-slider", {
    
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