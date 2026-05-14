const button = document.getElementById('theme-toggle');

if (button) {
    const icon = button.querySelector('i');

    button.addEventListener('click', () => {
        // 1. Inicia a animação de saída (gira e some)
        icon.style.transform = 'rotate(180deg) scale(0)';
        icon.style.opacity = '0';

        setTimeout(() => {
            // 2. Troca a classe do body
            const isDark = document.body.classList.toggle('dark');

            // 3. Troca o ícone baseado no estado atual
            if (isDark) {
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
            }

            // 4. Reseta a posição instantaneamente antes de reaparecer (opcional)
            icon.style.transition = 'none';
            icon.style.transform = 'rotate(-180deg) scale(0)';

            // 5. Força o navegador a processar a mudança de posição acima
            icon.offsetHeight;

            // 6. Ativa a animação de entrada
            icon.style.transition = 'all 0.3s ease';
            icon.style.transform = 'rotate(0deg) scale(1)';
            icon.style.opacity = '1';

        }, 300); // Aumentei um pouco o tempo para combinar com o CSS
    });
}

/* ========================= */
/* SLIDER FADE */
/* ========================= */

const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

let currentSlide = 0;

function showSlide(index){

    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    dots.forEach(dot => {
        dot.classList.remove('active');
    });

    slides[index].classList.add('active');
    dots[index].classList.add('active');

    currentSlide = index;
}

function nextSlide(){

    currentSlide++;

    if(currentSlide >= slides.length){
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
/* HEADER ANIMATIONS  */
/* ========================= */

const header = document.querySelector("header");

let ultimoScroll = window.scrollY;
let opacity = 1;

window.addEventListener("scroll", () => {

    let scrollAtual = window.scrollY;

    // DESCENDO
    if(scrollAtual > ultimoScroll){
        opacity -= 0.08;
    }
    else{
        opacity += 0.08;
    }
    if(opacity < 0){
        opacity = 0;
    }
    if(opacity > 1){
        opacity = 1;
    }
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
        const sectionHeight = section.clientHeight;

        if(scrollY >= sectionTop){
            currentSection = section.getAttribute("id");
        }

    });

    navItems.forEach(item => {

        item.classList.remove("active");

        if(item.dataset.section === currentSection){
            item.classList.add("active");
        }

    });

});