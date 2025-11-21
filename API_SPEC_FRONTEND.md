# 📡 Especificação da API - InfoStock Backend

> **Para o time de Frontend**: Este documento contém todas as informações necessárias para integrar com a API do backend.

## 🌐 Base URL

```
http://localhost:8080/api
```

---

## 🔐 Autenticação

A API usa **JWT (JSON Web Token)** para autenticação.

### Como Funciona:

1. **Login ou Registro** → Recebe um token
2. **Inclui o token** em todas as requisições protegidas:
   ```
   Authorization: Bearer {token}
   ```
3. **Token expira** em 24 horas

---

## 🚀 Endpoints Públicos (Sem Autenticação)

### 1. Health Check
```http
GET /health
```
**Resposta:**
```json
{
  "status": "ok",
  "message": "API está funcionando!"
}
```

### 2. Login
```http
POST /login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "senha": "senha123"
}
```
**Resposta (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "Nome do Usuário",
    "email": "usuario@email.com",
    "perfil": "VENDEDOR"
  }
}
```

**Erros:**
- `401 Unauthorized`: Credenciais inválidas

### 3. Registro (NOVO!)
```http
POST /registro
Content-Type: application/json

{
  "nome": "Nome Completo",
  "email": "novo@email.com",
  "senha": "senha123",
  "perfil": "VENDEDOR"  // Opcional: VENDEDOR ou GERENTE
}
```
**Resposta (201 Created):**
```json
{
  "mensagem": "Usuário cadastrado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 5,
    "nome": "Nome Completo",
    "email": "novo@email.com",
    "perfil": "VENDEDOR"
  }
}
```

**Validações:**
- `nome`: mínimo 3 caracteres
- `email`: deve ser válido e único
- `senha`: mínimo 6 caracteres
- `perfil`: "VENDEDOR" (padrão) ou "GERENTE"

**Erros:**
- `409 Conflict`: Email já cadastrado
- `400 Bad Request`: Dados inválidos

---

## 🛡️ Perfis de Usuário

| Perfil | Permissões |
|--------|-----------|
| **VENDEDOR** | Criar vendas, ver produtos/clientes/estoque |
| **GERENTE** | VENDEDOR + criar/editar produtos + gerenciar estoque |
| **ADMIN** | Acesso total (gerenciar usuários, deletar recursos) |

---

## 📦 Produtos

### Listar Produtos
```http
GET /produtos
Authorization: Bearer {token}
```
**Resposta:**
```json
[
  {
    "ID": 1,
    "sku": "NOTE-DELL-001",
    "nome": "Notebook Dell Inspiron 15",
    "categoria": "Notebooks",
    "marca": "Dell",
    "modelo": "Inspiron 15 3000",
    "preco": 3500,
    "garantia": 12,
    "status": "ATIVO",
    "estoque": {
      "quantidade_atual": 50,
      "localizacao": "A-01-02"
    },
    "fornecedores": [...]
  }
]
```

### Buscar Produto por ID
```http
GET /produtos/:id
Authorization: Bearer {token}
```

### Pesquisar Produtos
```http
GET /produtos/pesquisar?q=notebook
Authorization: Bearer {token}
```

### Filtrar por Categoria
```http
GET /produtos/categoria/:categoria
Authorization: Bearer {token}
```

### Filtrar por Marca
```http
GET /produtos/marca/:marca
Authorization: Bearer {token}
```

### Filtrar por Faixa de Preço
```http
GET /produtos/faixa-preco?min=1000&max=5000
Authorization: Bearer {token}
```

### Criar Produto
```http
POST /produtos
Authorization: Bearer {token}
Content-Type: application/json

{
  "sku": "PROD-001",
  "nome": "Nome do Produto",
  "categoria": "Categoria",
  "marca": "Marca",
  "modelo": "Modelo",
  "preco": 1500.00,
  "garantia": 12,
  "status": "ATIVO"
}
```
**Permissão:** ADMIN ou GERENTE

### Atualizar Produto
```http
PUT /produtos/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Novo Nome",
  "preco": 1600.00
}
```
**Permissão:** ADMIN ou GERENTE

### Deletar Produto
```http
DELETE /produtos/:id
Authorization: Bearer {token}
```
**Permissão:** ADMIN

---

## 👥 Clientes

### Listar Clientes
```http
GET /clientes
Authorization: Bearer {token}
```

### Buscar Cliente por ID
```http
GET /clientes/:id
Authorization: Bearer {token}
```

### Pesquisar Clientes
```http
GET /clientes/pesquisar?q=maria
Authorization: Bearer {token}
```

### Criar Cliente (Pessoa Física)
```http
POST /clientes
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Maria Silva",
  "cpf": "12345678900",
  "tipo_pessoa": "FISICA",
  "email": "maria@email.com",
  "telefone": "(11) 98765-4321",
  "data_nascimento": "1990-01-15T00:00:00Z",
  "endereco": "Rua ABC, 123",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01234567",
  "status": "ATIVO"
}
```

### Criar Cliente (Pessoa Jurídica)
```http
POST /clientes
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Empresa XYZ Ltda",
  "cnpj": "12345678000199",
  "tipo_pessoa": "JURIDICA",
  "email": "contato@empresa.com",
  "telefone": "(11) 3456-7890",
  "endereco": "Av. Paulista, 1000",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01310100",
  "status": "ATIVO"
}
```

---

## 💰 Vendas

### Criar Venda
```http
POST /vendas
Authorization: Bearer {token}
Content-Type: application/json

{
  "cliente_id": 1,
  "itens": [
    {
      "produto_id": 1,
      "quantidade": 2
    },
    {
      "produto_id": 2,
      "quantidade": 1
    }
  ]
}
```

**O que acontece:**
- ✅ Verifica estoque disponível
- ✅ Calcula valor total automaticamente
- ✅ Desconta do estoque
- ✅ Cria movimentação de estoque
- ✅ Status inicial: "ABERTA"

**Resposta:**
```json
{
  "ID": 1,
  "usuario_id": 1,
  "cliente_id": 1,
  "data": "2024-08-25T10:30:00Z",
  "valor_total": 11500,
  "status": "ABERTA",
  "usuario": {...},
  "cliente": {...},
  "itens": [...]
}
```

### Listar Vendas
```http
GET /vendas
Authorization: Bearer {token}
```

### Buscar Venda por ID
```http
GET /vendas/:id
Authorization: Bearer {token}
```

### Confirmar Venda
```http
PUT /vendas/:id/confirmar
Authorization: Bearer {token}
```
**Permissão:** ADMIN ou GERENTE

### Cancelar Venda
```http
PUT /vendas/:id/cancelar
Authorization: Bearer {token}
```
**Permissão:** ADMIN ou GERENTE

**O que acontece:** Produtos voltam ao estoque automaticamente

### Relatório de Vendas
```http
GET /vendas/relatorio?data_inicio=2024-01-01&data_fim=2024-12-31
Authorization: Bearer {token}
```
**Permissão:** ADMIN ou GERENTE

**Resposta:**
```json
{
  "total_vendas": 150,
  "valor_total": 450000.00,
  "vendas_abertas": 5,
  "vendas_confirmadas": 140,
  "vendas_canceladas": 5
}
```

---

## 📊 Estoque

### Listar Estoque
```http
GET /estoque
Authorization: Bearer {token}
```

### Buscar Estoque de Produto
```http
GET /estoque/produto/:produto_id
Authorization: Bearer {token}
```

### Produtos com Estoque Baixo
```http
GET /estoque/estoque-baixo?limite=10
Authorization: Bearer {token}
```

### Produtos Sem Estoque
```http
GET /estoque/sem-estoque
Authorization: Bearer {token}
```

### Entrada de Estoque
```http
POST /estoque/entrada
Authorization: Bearer {token}
Content-Type: application/json

{
  "produto_id": 1,
  "quantidade": 50,
  "origem": "COMPRA_FORNECEDOR"
}
```
**Permissão:** ADMIN ou GERENTE

### Saída de Estoque
```http
POST /estoque/saida
Authorization: Bearer {token}
Content-Type: application/json

{
  "produto_id": 1,
  "quantidade": 10,
  "origem": "AJUSTE_INVENTARIO"
}
```
**Permissão:** ADMIN ou GERENTE

---

## 🏢 Fornecedores

### Listar Fornecedores
```http
GET /fornecedores
Authorization: Bearer {token}
```

### Criar Fornecedor
```http
POST /fornecedores
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Fornecedor XYZ",
  "cnpj": "12345678000199",
  "contato": "(11) 98765-4321",
  "status": "ATIVO"
}
```
**Permissão:** ADMIN ou GERENTE

---

## 👤 Usuários

### Listar Usuários
```http
GET /usuarios
Authorization: Bearer {token}
```
**Permissão:** ADMIN

### Criar Usuário
```http
POST /usuarios
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "perfil": "VENDEDOR"
}
```
**Permissão:** ADMIN

---

## ❌ Códigos de Erro HTTP

| Código | Significado |
|--------|-------------|
| `200 OK` | Sucesso |
| `201 Created` | Recurso criado |
| `400 Bad Request` | Dados inválidos |
| `401 Unauthorized` | Não autenticado |
| `403 Forbidden` | Sem permissão |
| `404 Not Found` | Não encontrado |
| `409 Conflict` | Conflito (ex: email duplicado) |
| `500 Internal Server Error` | Erro no servidor |

---

## 💡 Dicas para o Frontend

### 1. Gerenciamento de Token
```javascript
// Salvar token após login/registro
localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data.usuario));

// Adicionar token em todas as requisições
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Limpar ao fazer logout
localStorage.removeItem('token');
localStorage.removeItem('user');
```

### 2. Interceptor de Erros (Axios)
```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado - redirecionar para login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 3. Verificar Permissões
```javascript
const user = JSON.parse(localStorage.getItem('user'));

// Verificar se pode criar produto
const podeEditarProdutos = ['ADMIN', 'GERENTE'].includes(user.perfil);

// Verificar se é ADMIN
const isAdmin = user.perfil === 'ADMIN';
```

### 4. Formato de Datas
```javascript
// Para enviar ao backend
const dataISO = new Date('1990-01-15').toISOString(); // "1990-01-15T00:00:00.000Z"

// Para exibir
const dataFormatada = new Date(data).toLocaleDateString('pt-BR');
```

### 5. Máscaras Recomendadas
- **CPF:** `000.000.000-00`
- **CNPJ:** `00.000.000/0000-00`
- **Telefone:** `(00) 00000-0000`
- **CEP:** `00000-000`
- **Preço:** `R$ 0.000,00`

---

## 🧪 Dados de Teste

Execute `go run scripts/seed.go` no backend para popular o banco.

**Usuários disponíveis:**
```
Admin:
Email: admin@infostock.com
Senha: admin123

Gerente:
Email: gerente@infostock.com
Senha: admin123

Vendedor:
Email: vendedor@infostock.com
Senha: admin123
```

**Produtos cadastrados:**
- 8 produtos (notebooks, smartphones, TVs, tablets, smartwatch)
- Estoque inicial: 50 unidades cada

**Clientes cadastrados:**
- 4 clientes (3 PF + 1 PJ)

---

## 🔄 CORS

O backend está configurado para aceitar requisições de:
```
http://localhost:5173
```

Se seu frontend rodar em outra porta, peça para atualizar o CORS no backend.

---

## 📞 Contato Backend

- **Porta:** 8080
- **Base URL:** `http://localhost:8080/api`
- **Health Check:** `http://localhost:8080/api/health`

---

## 🚀 Collection do Postman

Arquivo disponível: `postman_collection.json`
Importar no Postman para testar todos os endpoints.

---

**Última atualização:** 2025-11-18
