# Documentação da API - InfoStock Backend

## Visão Geral

API RESTful para gerenciamento de sistema de vendas de produtos eletrônicos.

**Base URL:** `http://localhost:8080/api`

---

## Autenticação

A API usa autenticação JWT (JSON Web Token). Após o login, inclua o token no header de todas as requisições protegidas:

```
Authorization: Bearer {seu_token_jwt}
```

### Login

**Endpoint:** `POST /api/login`

**Body:**
```json
{
  "email": "usuario@example.com",
  "senha": "senha123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "Nome do Usuário",
    "email": "usuario@example.com",
    "perfil": "ADMIN"
  }
}
```

---

## Perfis de Usuário

- **ADMIN**: Acesso total ao sistema
- **GERENTE**: Acesso a vendas, estoque, produtos e fornecedores
- **VENDEDOR**: Acesso a vendas e consultas

---

## Endpoints

### 🏥 Health Check

**Endpoint:** `GET /api/health`

**Autenticação:** Não requerida

**Response:**
```json
{
  "status": "ok",
  "message": "API está funcionando!"
}
```

---

## 📦 Produtos

### Listar Produtos
**GET** `/api/produtos`

**Headers:** Authorization required

**Response:**
```json
[
  {
    "ID": 1,
    "sku": "PROD-001",
    "nome": "Notebook Dell",
    "categoria": "Notebooks",
    "marca": "Dell",
    "modelo": "Inspiron 15",
    "preco": 3500.00,
    "garantia": 12,
    "status": "ATIVO",
    "estoque": {
      "quantidade_atual": 10,
      "localizacao": "A-01-02"
    }
  }
]
```

### Buscar Produto por ID
**GET** `/api/produtos/:id`

### Buscar Produto por SKU
**GET** `/api/produtos/sku/:sku`

### Buscar por Categoria
**GET** `/api/produtos/categoria/:categoria`

### Buscar por Marca
**GET** `/api/produtos/marca/:marca`

### Buscar por Faixa de Preço
**GET** `/api/produtos/faixa-preco?min=1000&max=5000`

### Pesquisar Produtos
**GET** `/api/produtos/pesquisar?q=notebook`

### Criar Produto
**POST** `/api/produtos`

**Permissão:** ADMIN ou GERENTE

**Body:**
```json
{
  "sku": "PROD-001",
  "nome": "Notebook Dell",
  "categoria": "Notebooks",
  "marca": "Dell",
  "modelo": "Inspiron 15",
  "preco": 3500.00,
  "garantia": 12,
  "status": "ATIVO"
}
```

### Atualizar Produto
**PUT** `/api/produtos/:id`

**Permissão:** ADMIN ou GERENTE

### Deletar Produto
**DELETE** `/api/produtos/:id`

**Permissão:** ADMIN

---

## 🏢 Fornecedores

### Listar Fornecedores
**GET** `/api/fornecedores`

### Listar Fornecedores Ativos
**GET** `/api/fornecedores/ativos`

### Buscar por ID
**GET** `/api/fornecedores/:id`

### Buscar por CNPJ
**GET** `/api/fornecedores/cnpj/:cnpj`

### Criar Fornecedor
**POST** `/api/fornecedores`

**Permissão:** ADMIN ou GERENTE

**Body:**
```json
{
  "nome": "Fornecedor XYZ",
  "cnpj": "12.345.678/0001-99",
  "contato": "(11) 98765-4321",
  "status": "ATIVO"
}
```

### Atualizar Fornecedor
**PUT** `/api/fornecedores/:id`

**Permissão:** ADMIN ou GERENTE

### Deletar Fornecedor
**DELETE** `/api/fornecedores/:id`

**Permissão:** ADMIN

### Vincular Produto
**POST** `/api/fornecedores/:id/produtos`

**Permissão:** ADMIN ou GERENTE

**Body:**
```json
{
  "produto_id": 1
}
```

### Desvincular Produto
**DELETE** `/api/fornecedores/:id/produtos/:produto_id`

**Permissão:** ADMIN ou GERENTE

---

## 👥 Clientes

### Listar Clientes
**GET** `/api/clientes`

### Listar Clientes Ativos
**GET** `/api/clientes/ativos`

### Buscar por ID
**GET** `/api/clientes/:id`

### Buscar por CPF
**GET** `/api/clientes/cpf/:cpf`

### Buscar por CNPJ
**GET** `/api/clientes/cnpj/:cnpj`

### Buscar por Cidade
**GET** `/api/clientes/cidade/:cidade`

### Buscar por Estado
**GET** `/api/clientes/estado/:estado`

### Pesquisar Clientes
**GET** `/api/clientes/pesquisar?q=joao`

### Criar Cliente (Pessoa Física)
**POST** `/api/clientes`

**Body:**
```json
{
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "tipo_pessoa": "FISICA",
  "email": "joao@email.com",
  "telefone": "(11) 98765-4321",
  "data_nascimento": "1990-01-15T00:00:00Z",
  "endereco": "Rua das Flores, 123",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01234-567",
  "status": "ATIVO"
}
```

### Criar Cliente (Pessoa Jurídica)
**POST** `/api/clientes`

**Body:**
```json
{
  "nome": "Empresa XYZ Ltda",
  "cnpj": "12.345.678/0001-99",
  "tipo_pessoa": "JURIDICA",
  "email": "contato@empresa.com",
  "telefone": "(11) 3456-7890",
  "endereco": "Av. Paulista, 1000",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01310-100",
  "status": "ATIVO"
}
```

### Atualizar Cliente
**PUT** `/api/clientes/:id`

### Deletar Cliente
**DELETE** `/api/clientes/:id`

**Permissão:** ADMIN

---

## 👤 Usuários

### Listar Usuários
**GET** `/api/usuarios`

**Permissão:** ADMIN

### Buscar por ID
**GET** `/api/usuarios/:id`

**Permissão:** ADMIN

### Criar Usuário
**POST** `/api/usuarios`

**Permissão:** ADMIN

**Body:**
```json
{
  "nome": "Maria Santos",
  "email": "maria@empresa.com",
  "senha": "senha123",
  "perfil": "VENDEDOR"
}
```

**Perfis válidos:** ADMIN, GERENTE, VENDEDOR

### Atualizar Usuário
**PUT** `/api/usuarios/:id`

**Permissão:** ADMIN

**Body:**
```json
{
  "nome": "Maria Santos",
  "perfil": "GERENTE",
  "senha": "nova_senha123"
}
```

### Deletar Usuário
**DELETE** `/api/usuarios/:id`

**Permissão:** ADMIN

### Alterar Própria Senha
**POST** `/api/usuarios/alterar-senha`

**Body:**
```json
{
  "senha_atual": "senha_antiga",
  "nova_senha": "senha_nova123"
}
```

---

## 📊 Estoque

### Listar Todo Estoque
**GET** `/api/estoque`

### Buscar Estoque de Produto
**GET** `/api/estoque/produto/:produto_id`

### Produtos com Estoque Baixo
**GET** `/api/estoque/estoque-baixo?limite=10`

### Produtos Sem Estoque
**GET** `/api/estoque/sem-estoque`

### Atualizar Localização
**PUT** `/api/estoque/localizacao/:produto_id`

**Permissão:** ADMIN ou GERENTE

**Body:**
```json
{
  "localizacao": "A-02-05"
}
```

### Entrada de Estoque
**POST** `/api/estoque/entrada`

**Permissão:** ADMIN ou GERENTE

**Body:**
```json
{
  "produto_id": 1,
  "quantidade": 50,
  "origem": "COMPRA_FORNECEDOR"
}
```

### Saída de Estoque
**POST** `/api/estoque/saida`

**Permissão:** ADMIN ou GERENTE

**Body:**
```json
{
  "produto_id": 1,
  "quantidade": 10,
  "origem": "AJUSTE_INVENTARIO"
}
```

### Listar Movimentações
**GET** `/api/estoque/movimentacoes`

### Movimentações por Produto
**GET** `/api/estoque/movimentacoes/:produto_id`

---

## 💰 Vendas

### Listar Vendas
**GET** `/api/vendas`

### Buscar Venda por ID
**GET** `/api/vendas/:id`

### Vendas por Cliente
**GET** `/api/vendas/cliente/:cliente_id`

### Vendas por Período
**GET** `/api/vendas/periodo?data_inicio=2024-01-01&data_fim=2024-12-31`

### Relatório de Vendas
**GET** `/api/vendas/relatorio?data_inicio=2024-01-01&data_fim=2024-12-31`

**Permissão:** ADMIN ou GERENTE

**Response:**
```json
{
  "total_vendas": 150,
  "valor_total": 450000.00,
  "vendas_abertas": 5,
  "vendas_confirmadas": 140,
  "vendas_canceladas": 5
}
```

### Criar Venda
**POST** `/api/vendas`

**Body:**
```json
{
  "cliente_id": 1,
  "itens": [
    {
      "produto_id": 1,
      "quantidade": 2
    },
    {
      "produto_id": 3,
      "quantidade": 1
    }
  ]
}
```

**Response:**
```json
{
  "ID": 1,
  "usuario_id": 1,
  "cliente_id": 1,
  "data": "2024-08-25T10:30:00Z",
  "valor_total": 7500.00,
  "status": "ABERTA",
  "usuario": { "nome": "Vendedor" },
  "cliente": { "nome": "João Silva" },
  "itens": [
    {
      "produto_id": 1,
      "quantidade": 2,
      "preco_unitario": 3500.00,
      "subtotal": 7000.00,
      "produto": { "nome": "Notebook Dell" }
    }
  ]
}
```

### Confirmar Venda
**PUT** `/api/vendas/:id/confirmar`

**Permissão:** ADMIN ou GERENTE

### Cancelar Venda
**PUT** `/api/vendas/:id/cancelar`

**Permissão:** ADMIN ou GERENTE

---

## Status de Vendas

- **ABERTA**: Venda criada mas ainda não confirmada
- **CONFIRMADA**: Venda confirmada e finalizada
- **CANCELADA**: Venda cancelada (estoque devolvido)

---

## Códigos de Status HTTP

- **200 OK**: Requisição bem-sucedida
- **201 Created**: Recurso criado com sucesso
- **400 Bad Request**: Dados inválidos
- **401 Unauthorized**: Não autenticado
- **403 Forbidden**: Sem permissão
- **404 Not Found**: Recurso não encontrado
- **409 Conflict**: Conflito (ex: SKU/CPF/CNPJ duplicado)
- **500 Internal Server Error**: Erro interno do servidor

---

## Observações Importantes

1. **Transações**: Operações de venda e estoque usam transações para garantir consistência
2. **Soft Delete**: Deleções são soft delete (preservam dados no banco)
3. **Estoque Automático**: Ao criar um produto, o estoque é criado automaticamente com quantidade 0
4. **Movimentações**: Todas as operações de estoque são registradas em movimentações
5. **Validações**: A API valida estoque disponível antes de criar vendas
6. **Cancelamento**: Ao cancelar vendas, os produtos retornam ao estoque automaticamente

---

## Exemplos de Uso com cURL

### Login
```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@empresa.com","senha":"senha123"}'
```

### Listar Produtos
```bash
curl -X GET http://localhost:8080/api/produtos \
  -H "Authorization: Bearer seu_token_aqui"
```

### Criar Venda
```bash
curl -X POST http://localhost:8080/api/vendas \
  -H "Authorization: Bearer seu_token_aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_id": 1,
    "itens": [
      {"produto_id": 1, "quantidade": 2},
      {"produto_id": 2, "quantidade": 1}
    ]
  }'
```
