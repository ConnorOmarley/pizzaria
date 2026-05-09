let carrinho = document.querySelector(".carrinho");
let cartButton = document.querySelector("#cart");

if (cartButton && carrinho) {
    cartButton.onclick = () => {
        carrinho.classList.toggle('active');
    }
}