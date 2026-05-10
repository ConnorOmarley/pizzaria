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