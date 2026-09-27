# 🍕 Pizzaria Taurus

![PHP](https://img.shields.io/badge/PHP-8.2-777BB4?style=flat-square)
![MariaDB](https://img.shields.io/badge/MariaDB-10.4-003545?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square)

Site web completo de uma pizzaria, com **cardápio online**, carrinho de compras, autenticação de usuários, painel administrativo financeiro e acompanhamento de pedidos em tempo real na cozinha.

---

## 👥 Trabalho em equipe

Projeto feito em parceria com **[@Fabioshit](https://github.com/Fabioshit)**, que iniciou o repositório e participou do desenvolvimento.

O histórico de commits é real e está preservado: os commits dos dois autores aparecem misturados, sem reescrita. Contribuições principais do lado de cá: painel de **contabilidade** com KPIs e gráficos, redesign da interface, **tela de login de usuários** e a documentação completa do projeto (incluindo este README).

---

## ✨ Funcionalidades

### Loja (área pública)

- 🍕 Cardápio com pizzas doces e salgadas, avaliações e carrossel
- 🛒 Carrinho de compras lateral com customização de pizza (adicionar/remover ingredientes)
- 💳 Checkout com **PIX**, débito e crédito (com parcelamento)
- 🌙 Tema **dark/light** (preferência salva no navegador)
- 📱 Botão flutuante do WhatsApp

### Usuários (clientes)

- 📝 Cadastro, login e logout (sidebar com abas)
- 🔐 Senhas com hash (bcrypt)

### Painel administrativo

- 🍕 **CRUD completo de pizzas** — listar, adicionar, editar, excluir e alterar disponibilidade + upload de imagens
- 📊 **Contabilidade** — KPIs e gráficos (Chart.js) de faturamento mensal e vendas por tipo
- 👨‍🍳 **Kitchen Live** — kanban de pedidos em tempo real (Na Esteira / No Forno / Pronto p/ Entrega) com relógio ao vivo

---

## 🛠️ Stack

| Camada | Tecnologia |
| --- | --- |
| Linguagem | PHP 8.2+ (puro, sem framework) |
| Frontend | HTML + CSS + JavaScript (vanilla) |
| Banco | MariaDB/MySQL 10.4+ |
| Servidor | PHP built-in server |
| Gráficos | Chart.js (CDN) |
| Ícones | Font Awesome |
| Fontes | Google Fonts (Poppins, JetBrains Mono) |

---

## 🚀 Como rodar

### 1. Iniciar (Windows)

Duplo clique em **`iniciar-pizzaria.bat`** — servidor sobe em `http://localhost:8081`.

> Alternativa manual: `php -S localhost:8081`

### 2. Setup do banco (primeira vez)

1. Tenha **MariaDB/MySQL** rodando na porta **3307**
2. Acesse `http://localhost:8081/config/setup.php` — cria o banco, tabelas, admin padrão e dados de exemplo

**Alternativa:** importe o dump `pizzaria_taurus.sql` pelo phpMyAdmin.

### Credenciais do admin

| Campo | Valor |
| --- | --- |
| Usuário | `admin` |
| Senha | `password` |

> ⚠️ Altere a senha do admin antes de usar em produção.

---

## 📁 Estrutura do projeto

```
Pizzaria/
├── index.php               # Loja principal (cardápio, carrinho, auth, pagamento)
├── iniciar-pizzaria.bat    # Início rápido (Windows)
├── pizzaria_taurus.sql     # Dump do banco (schema + dados)
├── config/
│   ├── db.php              # Conexão MySQL
│   └── setup.php           # Setup automático do banco
├── auth/
│   └── api.php             # API de autenticação de usuários
├── admin/
│   ├── login.php           # Login do admin
│   ├── panel.php           # Painel (CRUD pizzas + contabilidade)
│   ├── kitchen.php         # Kitchen Live (kanban de pedidos)
│   ├── api.php             # API do admin (CRUD pizzas)
│   └── logout.php
├── assets/
│   ├── css/                # styles, auth, payment, admin, kitchen
│   ├── js/                 # ms.js (loja), admin.js, kitchen.js
│   └── img/
└── uploads/                # Imagens enviadas pelo painel
```

---

## 🗄️ Banco de dados

Tabelas: `users` (clientes), `admins` (administradores) e `pizzas` (cardápio com descontos, categoria doce/salgada, avaliações).

> A configuração do banco está em `config/db.php` (o projeto não usa `.env`).

---

## 📝 Licença

MIT — ver [LICENSE](LICENSE).