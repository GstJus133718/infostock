# 📊 Endpoints do Dashboard - InfoStock

## 🎯 Endpoint Principal

### GET /api/dashboard/estatisticas

Retorna **TODAS** as estatísticas necessárias para o dashboard em uma única requisição.

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "vendas_mes_atual": {
    "total": 100000.00,
    "quantidade": 45,
    "variacao": 10.5
  },
  "produtos_vendidos": {
    "total": 150,
    "variacao": -0.5
  },
  "fornecedores_ativos": {
    "total": 98,
    "novos_este_mes": 5
  },
  "estoque_baixo": 5
}
```

**Campos:**
- `vendas_mes_atual.total`: Valor total de vendas do mês (R$)
- `vendas_mes_atual.quantidade`: Número de vendas realizadas
- `vendas_mes_atual.variacao`: Percentual de variação em relação ao mês anterior
- `produtos_vendidos.total`: Quantidade de produtos vendidos no mês
- `produtos_vendidos.variacao`: Percentual de variação
- `fornecedores_ativos.total`: Total de fornecedores ativos
- `fornecedores_ativos.novos_este_mes`: Novos fornecedores este mês
- `estoque_baixo`: Quantidade de produtos com estoque < 10

---

## 📈 Vendas por Mês (Gráfico de Barras)

### GET /api/vendas/por-mes?meses=8

Retorna vendas agregadas por mês para o gráfico de barras.

**Query Parameters:**
- `meses` (opcional): Número de meses (padrão: 8)

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "mes": "Jan",
    "ano": 2025,
    "total": 30000.00,
    "quantidade": 15
  },
  {
    "mes": "Fev",
    "ano": 2025,
    "total": 40000.00,
    "quantidade": 20
  },
  {
    "mes": "Mar",
    "ano": 2025,
    "total": 25000.00,
    "quantidade": 12
  }
]
```

**Exemplo de Uso (Frontend):**
```javascript
const response = await axios.get('/api/vendas/por-mes?meses=8');

// Para Chart.js
const labels = response.data.map(item => item.mes);
const data = response.data.map(item => item.total);
```

---

## 🥧 Produtos Mais Vendidos (Gráfico Pizza)

### GET /api/vendas/produtos-mais-vendidos?limite=5

Retorna os produtos mais vendidos com percentuais calculados.

**Query Parameters:**
- `limite` (opcional): Número de produtos (padrão: 5)

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "produto_id": 1,
    "produto_nome": "Notebook Dell Inspiron 15",
    "quantidade_total": 48,
    "valor_total": 168000.00,
    "percentual": 34.3
  },
  {
    "produto_id": 2,
    "produto_nome": "Samsung Galaxy S23",
    "quantidade_total": 28,
    "valor_total": 126000.00,
    "percentual": 20.0
  },
  {
    "produto_id": 3,
    "produto_nome": "iPhone 15 Pro",
    "quantidade_total": 23,
    "valor_total": 172500.00,
    "percentual": 16.4
  }
]
```

**Exemplo de Uso (Frontend):**
```javascript
const response = await axios.get('/api/vendas/produtos-mais-vendidos?limite=5');

// Para Chart.js
const labels = response.data.map(item => item.produto_nome);
const data = response.data.map(item => item.percentual);
```

---

## 📦 Produtos com Estoque Baixo

### GET /api/estoque/estoque-baixo?limite=10

Retorna produtos com estoque abaixo do limite.

**Query Parameters:**
- `limite` (opcional): Limite de estoque (padrão: 10)

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "ID": 5,
    "produto_id": 5,
    "quantidade_atual": 3,
    "localizacao": "A-05-05",
    "produto": {
      "ID": 5,
      "sku": "TV-LG-001",
      "nome": "Smart TV LG 65 OLED",
      "preco": 6500
    }
  }
]
```

---

## 💡 Exemplo de Integração Completa

### React + Axios

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [vendasMensais, setVendasMensais] = useState([]);
  const [produtosMaisVendidos, setProdutosMaisVendidos] = useState([]);
  const [estoqueBaixo, setEstoqueBaixo] = useState([]);

  useEffect(() => {
    carregarDashboard();
  }, []);

  const carregarDashboard = async () => {
    try {
      // 1. Estatísticas principais
      const statsRes = await axios.get('/api/dashboard/estatisticas');
      setStats(statsRes.data);

      // 2. Vendas mensais (gráfico de barras)
      const vendasRes = await axios.get('/api/vendas/por-mes?meses=8');
      setVendasMensais(vendasRes.data);

      // 3. Produtos mais vendidos (gráfico pizza)
      const produtosRes = await axios.get('/api/vendas/produtos-mais-vendidos?limite=5');
      setProdutosMaisVendidos(produtosRes.data);

      // 4. Estoque baixo
      const estoqueRes = await axios.get('/api/estoque/estoque-baixo?limite=10');
      setEstoqueBaixo(estoqueRes.data);

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    }
  };

  return (
    <div>
      {/* Cards de Estatísticas */}
      <div className="stats-cards">
        <div className="card">
          <h3>Total Vendas do Mês</h3>
          <p>R$ {stats?.vendas_mes_atual.total.toLocaleString('pt-BR')}</p>
          <span className={stats?.vendas_mes_atual.variacao >= 0 ? 'positive' : 'negative'}>
            {stats?.vendas_mes_atual.variacao.toFixed(1)}% em relação ao mês anterior
          </span>
        </div>

        <div className="card">
          <h3>Produtos Vendidos</h3>
          <p>{stats?.produtos_vendidos.total}</p>
          <span className={stats?.produtos_vendidos.variacao >= 0 ? 'positive' : 'negative'}>
            {stats?.produtos_vendidos.variacao.toFixed(1)}% em relação ao mês anterior
          </span>
        </div>

        <div className="card">
          <h3>Fornecedores Ativos</h3>
          <p>{stats?.fornecedores_ativos.total}</p>
          <span className="info">
            +{stats?.fornecedores_ativos.novos_este_mes} novos fornecedores
          </span>
        </div>
      </div>

      {/* Gráfico de Barras - Vendas Mensais */}
      <BarChart data={vendasMensais} />

      {/* Gráfico Pizza - Produtos Mais Vendidos */}
      <PieChart data={produtosMaisVendidos} />

      {/* Lista de Produtos com Estoque Baixo */}
      <EstoqueBaixoList data={estoqueBaixo} />
    </div>
  );
}
```

---

## 📊 Exemplo com Chart.js

### Gráfico de Barras

```javascript
import { Bar } from 'react-chartjs-2';

function BarChart({ data }) {
  const chartData = {
    labels: data.map(item => item.mes),
    datasets: [{
      label: 'Vendas Mensais',
      data: data.map(item => item.total),
      backgroundColor: 'rgba(255, 159, 64, 0.8)',
    }]
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `R$ ${value.toLocaleString('pt-BR')}`
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
}
```

### Gráfico Pizza

```javascript
import { Pie } from 'react-chartjs-2';

function PieChart({ data }) {
  const chartData = {
    labels: data.map(item => item.produto_nome),
    datasets: [{
      data: data.map(item => item.percentual),
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
      ],
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: context => {
            const item = data[context.dataIndex];
            return [
              `${item.produto_nome}`,
              `${item.quantidade_total} unidades`,
              `${item.percentual.toFixed(1)}%`
            ];
          }
        }
      }
    }
  };

  return <Pie data={chartData} options={options} />;
}
```

---

## 🎨 Formatação de Valores

```javascript
// Moeda (R$)
const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

// Percentual
const formatarPercentual = (valor) => {
  const sinal = valor >= 0 ? '+' : '';
  return `${sinal}${valor.toFixed(1)}%`;
};

// Uso:
<p>{formatarMoeda(stats.vendas_mes_atual.total)}</p>
<span>{formatarPercentual(stats.vendas_mes_atual.variacao)}</span>
```

---

## ⚡ Dicas de Performance

1. **Cache:** Considere fazer cache do dashboard por alguns minutos
2. **Loading:** Mostre skeleton/loading enquanto carrega
3. **Error Handling:** Trate erros e mostre mensagem amigável
4. **Refresh:** Adicione botão para atualizar dados
5. **Interval:** Use `setInterval` para atualizar automaticamente (ex: a cada 5 minutos)

```javascript
// Auto-refresh a cada 5 minutos
useEffect(() => {
  carregarDashboard();

  const interval = setInterval(() => {
    carregarDashboard();
  }, 5 * 60 * 1000); // 5 minutos

  return () => clearInterval(interval);
}, []);
```

---

## 📝 Resumo dos Endpoints

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/dashboard/estatisticas` | GET | Todas as estatísticas (cards) |
| `/api/vendas/por-mes` | GET | Dados para gráfico de barras |
| `/api/vendas/produtos-mais-vendidos` | GET | Dados para gráfico pizza |
| `/api/estoque/estoque-baixo` | GET | Lista de produtos com estoque baixo |

---

**✅ Todos os dados do print do dashboard estão disponíveis!**
