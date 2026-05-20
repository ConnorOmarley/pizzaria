<!DOCTYPE html>
<html lang="pt-BR">
<head>

    <!--INICIO CONFIGURAÇÕES DO SITE-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!--FIM CONFIGURAÇÕES DO SITE-->

    <!--INICIO CSS ICONES API-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!--FIM CSS ICONES API-->

    <!--INICIO CSS SWIPER SLIDE-->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css"/>
    <!--FIM CSS SWIPER SLIDE-->

    <!--INICIO CSS DO SITE-->
    <link rel="stylesheet" href="assets/css/style.css">
    <!--FIM CSS DO SITE-->

    <!--INICIO FAVICON-->
    <link rel="shortcut icon" type="image/x-icon" href="assets/img/msFavicon.png">
    <!--FIM FAVICON-->

    <title>Pizzaria Taurus</title>

</head>
<body>

<!--INICIO CABEÇALHO DO SITE-->
<header class="topo-site">

    <!--INICIO LOGO DO SITE-->
    <a href="index.html" class="logo">
        <i class="fas fa-pizza-slice"></i>
        Pizzaria Taurus
    </a>
    <!--FIM LOGO DO SITE-->

    <!--INICIO MENU DO SITE-->
    <nav class="menu-site">
        <a href="index.html">Inicio</a>
        <a href="empresa.html">Empresa</a>
        <a href="menu.html">Cardápio</a>
        <a href="loja.html">Montar Pedido</a>
        <a href="blog.html">Novidades</a>
        <a href="contatos.html">Fale Conosco</a>
    </nav>
    <!--FIM MENU DO SITE-->

    <!--INICIO ICONES DO SITE-->
    <div class="icons">
        <div id="cart" class="fas fa-shopping-cart"></div>
        <div id="login" class="fas fa-user"></div>
        <div id="menu" class="fas fa-bars"></div>
    </div>
    <!--FIM ICONES DO SITE-->

    <!--INICIO CARRINHO TOPO DO SITE-->
    <div class="carrinho">

        <!--INICIO ITEM CARRINHO-->
        <div class="box">
            <i class="fas fa-times"></i>

            <img src="assets/img/carrinho-1.png" alt="Pizza Frango">

            <div class="content">
                <h3>Pizza Frango</h3>

                <span class="quantidade">1</span>
                <span class="multiplica">x</span>
                <span class="valor">R$ 77,77</span>
            </div>
        </div>
        <!--FIM ITEM CARRINHO-->

        <!--INICIO ITEM CARRINHO-->
        <div class="box">
            <i class="fas fa-times"></i>

            <img src="assets/img/carrinho-2.png" alt="Pizza Calabresa">

            <div class="content">
                <h3>Pizza Calabresa</h3>

                <span class="quantidade">1</span>
                <span class="multiplica">x</span>
                <span class="valor">R$ 77,77</span>
            </div>
        </div>
        <!--FIM ITEM CARRINHO-->

        <!--INICIO ITEM CARRINHO-->
        <div class="box">
            <i class="fas fa-times"></i>

            <img src="assets/img/carrinho-3.png" alt="Pizza Portuguesa">

            <div class="content">
                <h3>Pizza Portuguesa</h3>

                <span class="quantidade">1</span>
                <span class="multiplica">x</span>
                <span class="valor">R$ 77,77</span>
            </div>
        </div>
        <!--FIM ITEM CARRINHO-->

        <!--INICIO TOTAL CARRINHO-->
        <h3 class="total">Total: R$ 171,90</h3>

        <a href="carrinho.html" class="btn">
            Ir Para O Carrinho
        </a>
        <!--FIM TOTAL CARRINHO-->

    </div>
    <!--FIM CARRINHO TOPO DO SITE-->

    <!--INICIO LOGIN TOPO DO SITE-->
    <div class="login-form">

        <h3>Acesse Sua Conta</h3>

        <form action="" method="post">

            <input
                type="email"
                name="email"
                class="box"
                placeholder="Seu E-mail"
            >

            <input
                type="password"
                name="senha"
                class="box"
                placeholder="Sua Senha"
            >

            <!--INICIO LEMBRAR SENHA-->
            <div class="lembrar-senha">

                <input 
                    type="checkbox" 
                    name="lembrar" 
                    id="relembrar"
                >

                <label for="relembrar">
                    Me lembrar da senha
                </label>

            </div>
            <!--FIM LEMBRAR SENHA-->

            <button 
                type="submit"
                name="sendLogin"
                class="btn"
            >
                Acessar
            </button>

        </form>

    </div>
    <!--FIM LOGIN TOPO DO SITE-->

</header>
<!--FIM CABEÇALHO DO SITE-->