# 🧪 Guia de Teste - InfoStock Frontend

## 📋 Checklist de Testes

Use este guia para testar todas as funcionalidades implementadas.

---

## 🚀 Preparação

### 1. Iniciar o Backend
```bash
# No diretório do backend
go run main.go

# Se quiser dados de teste
go run scripts/seed.go
```

Backend deve estar em: **http://localhost:8080**

### 2. Iniciar o Frontend
```bash
# No diretório do frontend
npm install
npm run dev
```

Frontend estará em: **http://localhost:5173**

---

## ✅ Testes de Autenticação

### Teste 1: Acesso sem Login
- [ ] Acesse http://localhost:5173
- [ ] Deve mostrar a tela de login
- [ ] Tente acessar http://localhost:5173/home
- [ ] Deve redirecionar para /login

### Teste 2: Login com Sucesso
- [ ] Na tela de login, use: admin@infostock.com / admin123
- [ ] Clique em "Entrar no Sistema"
- [ ] Deve mostrar loading (spinner)
- [ ] Deve redirecionar para /home (Dashboard)
- [ ] Header deve mostrar nome "Admin" e perfil "ADMIN"

### Teste 3: Login com Erro
- [ ] Faça logout (feche e abra o navegador)
- [ ] Tente login com: teste@teste.com / senhaerrada
- [ ] Deve mostrar mensagem de erro em vermelho
- [ ] Não deve redirecionar

### Teste 4: Validações de Campos
- [ ] Deixe email vazio e clique em "Entrar"
- [ ] Deve mostrar "Por favor, preencha todos os campos"
- [ ] Digite email inválido (ex: teste@)
- [ ] Deve mostrar "Por favor, insira um email válido"

---

## ✅ Testes do Dashboard

### Teste 5: Visualização de Estatísticas
- [ ] Faça login como admin
- [ ] Veja o Dashboard
- [ ] Deve mostrar 3 cards com estatísticas:
  - Total Vendas do Mês (com % de variação)
  - Produtos Vendidos (com % de variação)
  - Fornecedores Ativos (com novos do mês)

### Teste 6: Gráfico de Vendas Mensais
- [ ] Veja o gráfico de barras laranja
- [ ] Deve mostrar "Vendas Mensais" com "Últimos X meses"
- [ ] Passe o mouse sobre as barras
- [ ] Deve mostrar tooltip com valor em R$

### Teste 7: Gráfico de Produtos Mais Vendidos
- [ ] Veja o gráfico de pizza colorido
- [ ] Deve mostrar 5 produtos com labels
- [ ] Labels devem ter nome e percentual
- [ ] Cores diferentes para cada fatia

### Teste 8: Produtos com Estoque Baixo
- [ ] Veja a seção "Produtos com Estoque Baixo"
- [ ] Badge vermelho com número de produtos
- [ ] Lista com produtos (se houver)
- [ ] Produtos com estoque < 5 devem ter fundo vermelho
- [ ] Produtos com estoque entre 5-10 devem ter fundo amarelo

### Teste 9: Ações Rápidas
- [ ] Veja os 4 botões de ações rápidas
- [ ] Clique em "Nova Venda" → deve ir para /sales
- [ ] Volte e clique em "Novo Produto" → deve ir para /products
- [ ] Clique em "Fornecedores" → deve ir para /suppliers
- [ ] Clique em "Relatórios" → deve ir para /relatorios

### Teste 10: Botão de Refresh
- [ ] Clique no ícone de refresh no header
- [ ] Ícone deve girar
- [ ] Dados devem ser recarregados

---

## ✅ Testes da Página de Produtos

### Teste 11: Visualização de Produtos
- [ ] Navegue para /products
- [ ] Deve mostrar 3 cards de estatísticas:
  - Valor Total em Estoque (R$)
  - Total Produtos em Estoque (quantidade)
  - Categorias (número)
- [ ] Deve mostrar tabela com produtos
- [ ] Cada produto deve ter: ID, Nome, Categoria, Fornecedor, Quantidade, Valor Unit., Valor Total, Status, Ações

### Teste 12: Busca de Produtos
- [ ] Digite algo na busca (ex: "RTX")
- [ ] Tabela deve filtrar em tempo real
- [ ] Teste buscar por: nome, SKU, categoria
- [ ] Limpe a busca, deve mostrar todos novamente

### Teste 13: Loading State
- [ ] Recarregue a página
- [ ] Deve mostrar spinner com "Carregando..."
- [ ] Após carregar, deve mostrar os produtos

### Teste 14: Criar Produto (ADMIN/GERENTE)
- [ ] Clique em "Novo Produto"
- [ ] Modal deve abrir
- [ ] Preencha:
  - SKU: TESTE-001
  - Nome: Produto de Teste
  - Categoria: Eletrônicos
  - Marca: Teste
  - Preço: 100.00
- [ ] Clique em "Criar"
- [ ] Modal deve fechar
- [ ] Produto deve aparecer na tabela
- [ ] Estatísticas devem atualizar

### Teste 15: Editar Produto (ADMIN/GERENTE)
- [ ] Clique em "Editar" em um produto
- [ ] Modal deve abrir com dados preenchidos
- [ ] Título deve ser "Editar Produto"
- [ ] Altere o nome
- [ ] Clique em "Atualizar"
- [ ] Mudanças devem aparecer na tabela

### Teste 16: Validação de Campos Obrigatórios
- [ ] Abra modal de novo produto
- [ ] Deixe campos obrigatórios vazios
- [ ] Tente salvar
- [ ] Navegador deve impedir e destacar campos

### Teste 17: Entrada de Estoque (ADMIN/GERENTE)
- [ ] Vá para aba "Entrada de Estoque"
- [ ] Veja lista de produtos
- [ ] Clique em "Entrada" (botão verde)
- [ ] Modal deve abrir
- [ ] Preencha quantidade: 10
- [ ] Escolha origem: "Compra de Fornecedor"
- [ ] Clique em "Confirmar"
- [ ] Volte para aba "Visualização"
- [ ] Quantidade do produto deve ter aumentado

### Teste 18: Saída de Estoque (ADMIN/GERENTE)
- [ ] Vá para aba "Entrada de Estoque"
- [ ] Clique em "Saída" (botão vermelho)
- [ ] Modal deve abrir
- [ ] Preencha quantidade: 5
- [ ] Escolha origem: "Venda"
- [ ] Clique em "Confirmar"
- [ ] Quantidade deve ter diminuído

### Teste 19: Movimentações
- [ ] Vá para aba "Movimentações"
- [ ] Deve mostrar tabela com histórico
- [ ] Entradas devem ter badge verde
- [ ] Saídas devem ter badge vermelho
- [ ] Deve mostrar: Tipo, Produto, Quantidade, Data, Origem
- [ ] Datas devem estar formatadas (DD/MM/YYYY)

### Teste 20: Navegação entre Abas
- [ ] Clique em "Visualização" → deve mostrar tabela
- [ ] Clique em "Entrada de Estoque" → deve mostrar lista de produtos
- [ ] Clique em "Movimentações" → deve mostrar histórico
- [ ] Aba ativa deve ter fundo branco e texto azul

---

## ✅ Testes de Permissões

### Teste 21: Permissões do VENDEDOR
- [ ] Faça logout
- [ ] Faça login como: vendedor@infostock.com / admin123
- [ ] Vá para /products
- [ ] Botão "Novo Produto" NÃO deve aparecer
- [ ] Botão "Editar" NÃO deve aparecer
- [ ] Aba "Entrada de Estoque":
  - Botões "Entrada" e "Saída" NÃO devem aparecer
- [ ] Pode apenas visualizar

### Teste 22: Permissões do GERENTE
- [ ] Faça logout
- [ ] Faça login como: gerente@infostock.com / admin123
- [ ] Vá para /products
- [ ] Botão "Novo Produto" DEVE aparecer
- [ ] Botão "Editar" DEVE aparecer
- [ ] Botões "Entrada" e "Saída" DEVEM aparecer
- [ ] Pode criar, editar e gerenciar estoque

### Teste 23: Permissões do ADMIN
- [ ] Faça login como admin
- [ ] Deve ter acesso total a tudo
- [ ] Todos os botões devem aparecer

---

## ✅ Testes de Responsividade

### Teste 24: Mobile (< 768px)
- [ ] Redimensione o navegador para mobile
- [ ] Sidebar deve estar escondida
- [ ] Botão de menu (hamburguer) deve aparecer
- [ ] Clique no menu → sidebar deve abrir por cima
- [ ] Clique fora → sidebar deve fechar
- [ ] Tabelas devem ter scroll horizontal
- [ ] Cards devem empilhar verticalmente

### Teste 25: Tablet (768px - 1024px)
- [ ] Redimensione para tablet
- [ ] Sidebar pode estar visível ou escondida
- [ ] Layout deve se adaptar
- [ ] Gráficos devem redimensionar

### Teste 26: Desktop (> 1024px)
- [ ] Redimensione para desktop
- [ ] Sidebar deve estar sempre visível
- [ ] Botão de menu não deve aparecer
- [ ] Layout completo deve ser visível

---

## ✅ Testes de UX/UI

### Teste 27: Feedback Visual
- [ ] Hover nos cards → deve dar scale
- [ ] Hover nas linhas da tabela → deve mudar cor
- [ ] Hover nos botões → deve mudar cor
- [ ] Clique em botões → deve ter animação

### Teste 28: Estados de Loading
- [ ] Ao carregar página → spinner
- [ ] Ao salvar formulário → botão desabilitado
- [ ] Ao fazer login → spinner no botão
- [ ] Ao atualizar dados → ícone girando

### Teste 29: Mensagens de Erro
- [ ] Tente criar produto sem SKU → erro
- [ ] Tente login inválido → mensagem de erro
- [ ] Erros devem ter fundo vermelho

### Teste 30: Formatação de Dados
- [ ] Valores em R$ devem ter: R$ 1.000,00
- [ ] Datas devem ter: DD/MM/YYYY
- [ ] IDs devem ter: #001, #002, etc
- [ ] Status devem ter badges coloridos

---

## ✅ Testes de Integração

### Teste 31: Fluxo Completo - Criar e Vender Produto
1. [ ] Faça login como ADMIN
2. [ ] Crie um novo produto:
   - SKU: PROD-TEST-001
   - Nome: Produto Teste Completo
   - Categoria: Teste
   - Preço: 500.00
3. [ ] Vá para "Entrada de Estoque"
4. [ ] Adicione 20 unidades (Compra de Fornecedor)
5. [ ] Vá para "Visualização"
6. [ ] Confirme que estoque = 20
7. [ ] Volte para "Entrada de Estoque"
8. [ ] Faça saída de 5 unidades (Venda)
9. [ ] Vá para "Movimentações"
10. [ ] Deve ter 2 registros (1 entrada, 1 saída)
11. [ ] Volte para "Visualização"
12. [ ] Estoque deve estar em 15

### Teste 32: Fluxo de Autenticação Completo
1. [ ] Abra navegador anônimo
2. [ ] Tente acessar /home → redireciona para /
3. [ ] Faça login com admin
4. [ ] Navegue entre páginas
5. [ ] Feche o navegador
6. [ ] Abra novamente
7. [ ] Acesse /home → deve entrar direto (token salvo)
8. [ ] Abra DevTools → Application → Local Storage
9. [ ] Deve ter 'token' e 'user'

---

## 🐛 Testes de Error Handling

### Teste 33: Backend Offline
- [ ] Pare o backend
- [ ] Tente fazer login
- [ ] Deve mostrar erro de conexão
- [ ] Recarregue página de produtos
- [ ] Deve mostrar erro ou loading infinito

### Teste 34: Token Expirado
- [ ] No DevTools → Application → Local Storage
- [ ] Edite o token para valor inválido
- [ ] Recarregue a página
- [ ] Deve redirecionar para login
- [ ] Local storage deve ser limpo

### Teste 35: Dados Inválidos
- [ ] Tente criar produto com preço negativo
- [ ] Tente fazer saída de estoque maior que disponível
- [ ] Backend deve retornar erro
- [ ] Frontend deve exibir mensagem

---

## 📊 Checklist Final

### Funcionalidades Essenciais
- [ ] Login/Logout funcionando
- [ ] Dashboard carregando dados reais
- [ ] Produtos: CRUD completo
- [ ] Produtos: Busca funcionando
- [ ] Estoque: Entrada/Saída funcionando
- [ ] Movimentações: Histórico visível
- [ ] Permissões: Diferentes por perfil
- [ ] Formatação: Valores e datas corretos
- [ ] Responsivo: Mobile, Tablet, Desktop
- [ ] Loading: Estados em todos os lugares

### Performance
- [ ] Página carrega em < 3 segundos
- [ ] Busca funciona em tempo real
- [ ] Gráficos renderizam suavemente
- [ ] Não há travamentos ou delays

### Segurança
- [ ] Rotas protegidas funcionando
- [ ] Token é enviado em todas requisições
- [ ] Logout limpa dados do localStorage
- [ ] Permissões são verificadas

---

## 🎯 Resultado Esperado

Se **todos os testes passarem**, você tem um sistema:
- ✅ Funcional
- ✅ Integrado com API
- ✅ Seguro
- ✅ Responsivo
- ✅ Com boa UX
- ✅ Pronto para apresentação!

---

## 🚨 Problemas Comuns

### Problema 1: "Erro ao buscar produtos"
**Solução:**
- Verifique se backend está rodando
- Verifique URL no .env
- Veja console do navegador para detalhes

### Problema 2: "Redireciona sempre para login"
**Solução:**
- Limpe localStorage
- Faça login novamente
- Verifique se token está sendo salvo

### Problema 3: "Permissões não funcionam"
**Solução:**
- Verifique perfil do usuário no localStorage
- Faça logout e login novamente
- Veja console para erros

### Problema 4: "Gráficos não aparecem"
**Solução:**
- Verifique se há dados no backend
- Execute seed.go para popular
- Veja console do navegador

### Problema 5: "Tabela vazia"
**Solução:**
- Verifique se backend tem produtos
- Execute seed.go
- Veja resposta da API no Network tab

---

## 📝 Notas

- Todos os testes devem ser feitos com backend rodando
- Use diferentes navegadores (Chrome, Firefox, Safari)
- Teste em diferentes resoluções
- Anote qualquer bug encontrado
- Verifique console do navegador sempre

**Boa sorte nos testes!** 🚀
