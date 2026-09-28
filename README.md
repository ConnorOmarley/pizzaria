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

O histórico de commits é real e está preservado: os commits dos dois autores aparecem misturados. Contribuições principais do lado de cá: painel de **contabilidade** com KPIs e gráficos, redesign da interface, **tela de login de usuários** e a documentação completa do projeto (incluindo este README).

> **Nota sobre o histórico.** Este repositório passou por uma reescrita de histórico com `git filter-branch` para remover do dump SQL um cadastro de cliente real (nome, e-mail e hash de senha) e o hash do administrador. A reescrita só alterou o *conteúdo* desses arquivos — **autoria, mensagens e datas foram preservadas**, e os 18 commits continuam sendo dos mesmos autores.

---

## ✨ Funcionalidades

### Loja (área pública)

- 🍕 Cardápio com pizzas doces e salgadas, avaliações e carrossel
- 🛒 Carrinho de compras lateral com customização de pizza (adicionar/remover ingredientes)
- 💳 **Modal de pagamento** com campos de PIX, débito e crédito — **interface apenas, não há integração com gateway**: nada é cobrado e nenhum pagamento é processado
- 🌙 Tema **dark/light** (preferência salva no navegador)
- 📱 Botão flutuante do WhatsApp

### Usuários (clientes)

- 📝 Cadastro, login e logout (sidebar com abas)
- 🔐 Senhas com hash (bcrypt)

### Painel administrativo

- 🍕 **CRUD completo de pizzas** — listar, adicionar, editar, excluir e alterar disponibilidade + upload de imagens
- 📊 **Contabilidade** — KPIs e gráficos (Chart.js) de faturamento mensal e vendas por tipo
- 👨‍🍳 **Kitchen Live** — kanban de pedidos com relógio ao vivo, **simulated no navegador**: `createOrder()` gera os pedidos localmente, sem API nem banco. É demonstração de interface, não fluxo real de cozinha

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

Depende de **qual caminho de instalação você usou**:

| Caminho | Usuário | Senha |
| --- | --- | --- |
| `config/setup.php` | `admin` | `admin123` |
| Importar `pizzaria_taurus.sql` | `admin` | `password` |

> ⚠️ **Ambas são credenciais de demonstração.** O hash do dump é o bcrypt público e conhecido da senha `password` (padrão do Laravel); o do `setup.php` é gerado na hora para `admin123`. Existem só para você entrar no painel numa instalação limpa. **Troque a senha do admin antes de usar em produção.**

O mesmo vale para a linha `users` do dump, que é um cliente fictício (`cliente@exemplo.com`) — não é o cadastro de ninguém.

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

## Limites conhecidos

- **A Kitchen Live é uma simulação do navegador.** `assets/js/kitchen.js` cria os pedidos com `createOrder()` e `nextOrderNum()` no cliente; não há `fetch`, `XMLHttpRequest`, WebSocket nem rota de API que ligue o kanban ao banco. Nenhum pedido do carrinho chega nele. O "tempo real" é o relógio (`setInterval` de 1s).
- **A contabilidade não mede vendas.** Os KPIs e gráficos somam preço, preço original, desconto e avaliação da tabela `pizzas` — ou seja, o catálogo, não o que foi vendido. Como não há pagamento nem pedido, não há como saber o faturamento real.
- **Não existe pagamento.** O modal de checkout tem os campos de cartão, débito e PIX, mas não há SDK, API nem webhook de gateway: nada é cobrado e nada é gravado.
- **As duas senhas de demonstração são diferentes.** `setup.php` cria `admin`/`admin123`; o dump traz `admin`/`password`. Ver a tabela em [Credenciais do admin](#credenciais-do-admin).
- **Não tem um único teste automatizado.** PHP puro sem `composer.json`, sem suíte e sem CI — a validação é manual.
- **Sem token anti-CSRF.** Não há uma única ocorrência de `csrf` no projeto: os formulários do painel autenticam por sessão e não se protegem contra requisição forjada de outro site.
- **Gráficos e ícones por CDN.** Chart.js, Font Awesome e Google Fonts vêm de terceiros; sem internet, o painel de contabilidade perde os gráficos.
- **O `setup.php` não versiona o schema.** Ele é idempotente (`CREATE TABLE IF NOT EXISTS` e seed só se a tabela estiver vazia), mas mudar o schema significa editar o `pizzaria_taurus.sql` e importar de novo — não há migration.

---

## 📝 Licença

MIT — ver [LICENSE](LICENSE).