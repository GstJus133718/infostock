import { useState } from 'react';
import api from '../utils/api';

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [salesByMonth, setSalesByMonth] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar estatísticas principais do dashboard
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/dashboard/estatisticas');
      setStats(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar estatísticas';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar vendas por mês (gráfico de barras)
  const fetchSalesByMonth = async (meses = 8) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/vendas/por-mes?meses=${meses}`);
      setSalesByMonth(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar vendas mensais';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar produtos mais vendidos (gráfico pizza)
  const fetchTopProducts = async (limite = 5) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/vendas/produtos-mais-vendidos?limite=${limite}`);
      setTopProducts(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar produtos mais vendidos';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar produtos com estoque baixo
  const fetchLowStock = async (limite = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/estoque/estoque-baixo?limite=${limite}`);
      setLowStock(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar estoque baixo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Carregar todos os dados do dashboard de uma vez
  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, salesRes, productsRes, stockRes] = await Promise.all([
        api.get('/dashboard/estatisticas'),
        api.get('/vendas/por-mes?meses=8'),
        api.get('/vendas/produtos-mais-vendidos?limite=5'),
        api.get('/estoque/estoque-baixo?limite=10'),
      ]);

      setStats(statsRes.data);
      setSalesByMonth(salesRes.data);
      setTopProducts(productsRes.data);
      setLowStock(stockRes.data);

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao carregar dashboard';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    salesByMonth,
    topProducts,
    lowStock,
    loading,
    error,
    fetchStats,
    fetchSalesByMonth,
    fetchTopProducts,
    fetchLowStock,
    fetchAllDashboardData,
  };
};
