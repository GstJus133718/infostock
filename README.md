# 📦 InfoStock - Sistema de Gerenciamento de Estoque

Sistema completo de gerenciamento de estoque desenvolvido com React + Vite para o frontend e Go (Golang) para o backend.

## 📋 Índice

- [Pré-requisitos](#-pré-requisitos)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Funcionalidades](#-funcionalidades)
- [Credenciais de Acesso](#-credenciais-de-acesso)
- [Troubleshooting](#-troubleshooting)

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

### Obrigatórios:
- **Node.js** (versão 18.x ou superior) - [Download](https://nodejs.org/)
- **npm** (vem junto com Node.js) ou **yarn**
- **Git** - [Download](https://git-scm.com/)

### Para rodar o backend (se necessário):
- **Go** (versão 1.21 ou superior) - [Download](https://go.dev/dl/)
- **PostgreSQL** (versão 14 ou superior) - [Download](https://www.postgresql.org/download/)

### Verificar instalação:
```bash
node --version    # Deve mostrar v18.x.x ou superior
npm --version     # Deve mostrar 9.x.x ou superior
git --version     # Deve mostrar a versão do Git
```

## 🚀 Tecnologias Utilizadas

### Frontend:
- **React** 18.3.1 - Biblioteca JavaScript para interfaces
- **Vite** 7.2.1 - Build tool e dev server
- **React Router DOM** 7.1.1 - Roteamento
- **Axios** - Cliente HTTP para requisições à API
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Biblioteca de ícones
- **jsPDF** e **jsPDF-AutoTable** - Geração de PDFs (Notas Fiscais)

### Backend:
- **Go (Golang)** - Linguagem de programação
- **PostgreSQL** - Banco de dados relacional
- **Gin** - Framework web para Go
- **GORM** - ORM para Go

## 📥 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/felipetozetto99/infostock.git
cd infostock
```

### 2. Instale as dependências do Frontend

```bash
npm install
```

> **Nota:** Se você preferir usar `yarn`, execute `yarn install`

### 3. Configure o Backend (se necessário)

Se o backend ainda não estiver rodando, siga estas etapas:

#### a) Clone o repositório do backend (se separado):
```bash
# Substitua pela URL correta do backend
git clone <URL_DO_BACKEND>
cd <PASTA_DO_BACKEND>
```

#### b) Instale as dependências do Go:
```bash
go mod download
```

#### c) Configure o banco de dados PostgreSQL:
```bash
# Entre no PostgreSQL
psql -U postgres

# Crie o banco de dados
CREATE DATABASE infostock;

# Saia do PostgreSQL
\q
```

#### d) Configure as variáveis de ambiente do backend:
Crie um arquivo `.env` na raiz do backend com:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=infostock
PORT=8080
JWT_SECRET=seu_secret_jwt_aqui
```

## ⚙️ Configuração

### Configure a URL da API no Frontend

Verifique se o arquivo `src/utils/api.js` está configurado corretamente:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // URL do backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

> **Importante:** Se o backend estiver rodando em outra porta ou endereço, atualize o `baseURL`.

## 🎯 Executando o Projeto

### 1. Inicie o Backend (Terminal 1)

```bash
# Entre na pasta do backend
cd <PASTA_DO_BACKEND>

# Execute o servidor Go
go run main.go
```

O backend estará rodando em: `http://localhost:8080`

### 2. Inicie o Frontend (Terminal 2)

```bash
# Entre na pasta do frontend (infostock)
cd infostock

# Execute o servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em: `http://localhost:5173`

### 3. Acesse o sistema

Abra seu navegador e acesse: **http://localhost:5173**

## 📁 Estrutura do Projeto

```
infostock/
├── public/                 # Arquivos públicos
│   └── vite.svg
├── src/
│   ├── assets/            # Imagens e recursos
│   │   ├── logo_infostock.png
│   │   └── logotipo_infostock.png
│   ├── components/        # Componentes reutilizáveis
│   │   └── ProtectedRoute.jsx
│   ├── hooks/             # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useClients.js
│   │   ├── useDashboard.js
│   │   ├── useProducts.js
│   │   ├── useSales.js
│   │   ├── useStock.js
│   │   └── useSuppliers.js
│   ├── pages/             # Páginas da aplicação
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Products/
│   │   ├── Sales/
│   │   ├── Suppliers/
│   │   └── Relatorios/
│   ├── styles/            # Estilos globais
│   │   ├── colors.css
│   │   └── colors.js
│   ├── utils/             # Funções utilitárias
│   │   ├── api.js              # Configuração do Axios
│   │   ├── auth.js             # Funções de autenticação
│   │   ├── formatters.js       # Formatadores de dados
│   │   └── notaFiscalGenerator.js  # Gerador de NF-e PDF
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Ponto de entrada
│   └── index.css          # Estilos globais
├── index.html             # HTML principal
├── package.json           # Dependências e scripts
├── vite.config.js         # Configuração do Vite
├── tailwind.config.js     # Configuração do Tailwind
└── README.md              # Este arquivo
```

## ✨ Funcionalidades

### 🏠 Dashboard
- Visão geral do sistema
- Estatísticas de vendas, produtos e estoque
- Gráficos e métricas

### 📦 Produtos
- **Visualização**: Lista completa de produtos com estoque
- **Cadastro**: Adicionar novos produtos
- **Edição**: Atualizar informações de produtos
- **Exclusão**: Remover produtos (apenas ADMIN)
- **Movimentações**: Histórico de entradas e saídas

### 🤝 Parceiros (Clientes e Fornecedores)
- **Clientes**: Gerenciamento completo (PF e PJ)
- **Fornecedores**: Cadastro e vinculação com produtos
- Validações de CPF/CNPJ
- Endereço completo

### 💰 Vendas
- Sistema de carrinho de compras
- Seleção de cliente
- Seleção de produtos com estoque disponível
- Cálculo automático de totais
- Geração de Nota Fiscal (DANFE) em PDF
- Histórico de vendas

### 📊 Relatórios
- Relatórios personalizados
- Exportação de dados

## 🔐 Credenciais de Acesso

O sistema possui 3 níveis de acesso:

### 👨‍💼 Administrador
- **Email:** admin@infostock.com
- **Senha:** admin123
- **Permissões:** Acesso total (CRUD completo em todos os módulos)

### 👔 Gerente
- **Email:** gerente@infostock.com
- **Senha:** admin123
- **Permissões:** Gerenciamento de produtos, estoque, vendas e fornecedores

### 🛒 Vendedor
- **Email:** vendedor@infostock.com
- **Senha:** admin123
- **Permissões:** Realizar vendas e consultar estoque

## 🐛 Troubleshooting

### Problema: "Cannot find module..."
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Problema: Porta 5173 já está em uso
```bash
# Mate o processo na porta 5173
# No Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# No Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

### Problema: CORS error ao fazer requisições
Verifique se:
1. O backend está rodando em `http://localhost:8080`
2. O backend possui as configurações de CORS corretas
3. A URL em `src/utils/api.js` está correta

### Problema: Erro ao gerar PDF (Nota Fiscal)
```bash
# Reinstale as dependências do jsPDF
npm install jspdf jspdf-autotable
```

### Problema: Erro de autenticação
1. Limpe o localStorage do navegador:
   - Abra o DevTools (F12)
   - Console → digite: `localStorage.clear()`
2. Faça login novamente

### Problema: Banco de dados não conecta
1. Verifique se o PostgreSQL está rodando:
   ```bash
   # Windows
   net start postgresql-x64-14
   
   # Mac
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```
2. Verifique as credenciais no arquivo `.env` do backend

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia o servidor de desenvolvimento

# Build
npm run build        # Cria build de produção

# Preview
npm run preview      # Preview do build de produção

# Lint
npm run lint         # Executa o ESLint
```

## 👥 Equipe de Desenvolvimento

- Felipe Tozetto - Desenvolvedor Full Stack

## 📄 Licença

Este projeto é um trabalho acadêmico.

## 🆘 Suporte

Se encontrar problemas durante a instalação ou execução:
1. Verifique se todos os pré-requisitos estão instalados
2. Consulte a seção de [Troubleshooting](#-troubleshooting)
3. Verifique os logs do console do navegador (F12)
4. Verifique os logs do terminal do backend

---

**Desenvolvido com ❤️ para o curso de [Nome do Curso]**
