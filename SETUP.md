# 🚀 Setup do Frontend - InfoStock

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Backend rodando em `http://localhost:8080`

## 🔧 Instalação

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

Ou crie manualmente o arquivo `.env` na raiz do projeto com:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_ENV=development
```

### 3. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

## 🌐 Variáveis de Ambiente

### `VITE_API_BASE_URL`
URL base da API do backend.
- **Desenvolvimento**: `http://localhost:8080/api`
- **Produção**: URL do seu servidor backend

### `VITE_APP_ENV`
Ambiente da aplicação.
- `development` - Desenvolvimento local
- `production` - Produção

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa linter

## 🔐 Autenticação

O sistema usa JWT (JSON Web Token) para autenticação. Após o login, o token é armazenado no `localStorage` e enviado automaticamente em todas as requisições.

### Usuários de Teste

Execute o seed no backend para criar usuários de teste:

```bash
# No diretório do backend
go run scripts/seed.go
```

**Usuários disponíveis:**
- **Admin**: admin@infostock.com / admin123
- **Gerente**: gerente@infostock.com / admin123
- **Vendedor**: vendedor@infostock.com / admin123

## 📚 Estrutura de Pastas

```
src/
├── hooks/          # Custom hooks para API
│   ├── useAuth.js       # Autenticação
│   ├── useProducts.js   # Produtos
│   ├── useClients.js    # Clientes
│   ├── useSales.js      # Vendas
│   ├── useStock.js      # Estoque
│   ├── useSuppliers.js  # Fornecedores
│   └── useUsers.js      # Usuários
├── utils/          # Utilitários
│   ├── api.js           # Configuração Axios
│   ├── auth.js          # Helpers de autenticação
│   └── formatters.js    # Formatação de dados
└── pages/          # Páginas da aplicação
```

## 🔌 Como Usar os Hooks

### Exemplo de Login:
```javascript
import { useAuth } from './hooks/useAuth';

function LoginPage() {
  const { login, loading, error } = useAuth();

  const handleLogin = async (email, senha) => {
    const result = await login(email, senha);
    if (result.success) {
      // Redirecionar para home
      navigate('/');
    } else {
      // Exibir erro
      console.error(result.error);
    }
  };
}
```

### Exemplo de Listar Produtos:
```javascript
import { useProducts } from './hooks/useProducts';
import { useEffect } from 'react';

function ProductsPage() {
  const { products, loading, error, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.ID}>
          <h3>{product.nome}</h3>
          <p>R$ {product.preco}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🛠️ Utilitários Disponíveis

### Formatação
```javascript
import { formatCurrency, formatDate, formatCPF } from './utils/formatters';

formatCurrency(3500.00);  // R$ 3.500,00
formatDate('2024-01-15'); // 15/01/2024
formatCPF('12345678900'); // 123.456.789-00
```

### Verificação de Permissões
```javascript
import { isAdmin, isGerente, hasPermission } from './utils/auth';

if (isAdmin()) {
  // Mostrar opções de admin
}

if (hasPermission(['ADMIN', 'GERENTE'])) {
  // Pode editar produtos
}
```

## 🐛 Troubleshooting

### Erro de CORS
Certifique-se de que o backend está configurado para aceitar requisições de `http://localhost:5173`.

### Token expirado
O token JWT expira em 24 horas. Após expirar, você será redirecionado automaticamente para a tela de login.

### Backend não conecta
Verifique se:
1. O backend está rodando em `http://localhost:8080`
2. A variável `VITE_API_BASE_URL` no `.env` está correta
3. Não há firewall bloqueando a conexão

## 📖 Documentação da API

Consulte os arquivos:
- `API_DOCUMENTATION.md` - Documentação completa da API
- `API_SPEC_FRONTEND.md` - Especificação para o frontend

## 🤝 Contribuindo

Este é um projeto acadêmico. Para contribuir:

1. Crie uma branch para sua feature
2. Faça suas alterações
3. Teste localmente
4. Abra um Pull Request

## 📝 Notas Importantes

- **Nunca commite o arquivo `.env`** - Ele está no `.gitignore`
- **Use `.env.example`** como template para criar seu `.env`
- **Em produção**, configure as variáveis de ambiente no servidor de hospedagem
