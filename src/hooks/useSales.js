import { useState } from 'react';
import api from '../utils/api';

export const useSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar todas as vendas
  const fetchSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/vendas');
      setSales(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar vendas';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar venda por ID
  const getSaleById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/vendas/${id}`);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar venda';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar vendas por cliente
  const getSalesByClient = async (clienteId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/vendas/cliente/${clienteId}`);
      setSales(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar vendas';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar vendas por período
  const getSalesByPeriod = async (dataInicio, dataFim) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(
        `/vendas/periodo?data_inicio=${dataInicio}&data_fim=${dataFim}`
      );
      setSales(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar vendas';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Relatório de vendas (ADMIN ou GERENTE)
  const getSalesReport = async (dataInicio, dataFim) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(
        `/vendas/relatorio?data_inicio=${dataInicio}&data_fim=${dataFim}`
      );
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao gerar relatório';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Criar venda
  const createSale = async (saleData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/vendas', saleData);
      await fetchSales(); // Atualiza a lista
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao criar venda';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Confirmar venda (ADMIN ou GERENTE)
  const confirmSale = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/vendas/${id}/confirmar`);
      await fetchSales(); // Atualiza a lista
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao confirmar venda';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Cancelar venda (ADMIN ou GERENTE)
  const cancelSale = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/vendas/${id}/cancelar`);
      await fetchSales(); // Atualiza a lista
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao cancelar venda';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    sales,
    loading,
    error,
    fetchSales,
    getSaleById,
    getSalesByClient,
    getSalesByPeriod,
    getSalesReport,
    createSale,
    confirmSale,
    cancelSale,
  };
};
