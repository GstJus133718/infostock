import { useState } from 'react';
import api from '../utils/api';

export const useStock = () => {
  const [stock, setStock] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Listar todo o estoque
  const fetchStock = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/estoque');
      setStock(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar estoque';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar estoque de um produto específico
  const getStockByProduct = async (produtoId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/estoque/produto/${produtoId}`);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar estoque';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Produtos com estoque baixo
  const getLowStock = async (limite = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/estoque/estoque-baixo?limite=${limite}`);
      setStock(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar estoque baixo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Produtos sem estoque
  const getOutOfStock = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/estoque/sem-estoque');
      setStock(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar produtos sem estoque';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Atualizar localização (ADMIN ou GERENTE)
  const updateLocation = async (produtoId, localizacao) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/estoque/localizacao/${produtoId}`, { localizacao });
      await fetchStock(); // Atualiza a lista
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao atualizar localização';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Entrada de estoque (ADMIN ou GERENTE)
  const addStock = async (produtoId, quantidade, origem = 'COMPRA_FORNECEDOR') => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/estoque/entrada', {
        produto_id: produtoId,
        quantidade,
        origem,
      });
      await fetchStock(); // Atualiza a lista
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao adicionar estoque';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Saída de estoque (ADMIN ou GERENTE)
  const removeStock = async (produtoId, quantidade, origem = 'AJUSTE_INVENTARIO') => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/estoque/saida', {
        produto_id: produtoId,
        quantidade,
        origem,
      });
      await fetchStock(); // Atualiza a lista
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao remover estoque';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Listar movimentações
  const fetchMovements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/estoque/movimentacoes');
      setMovements(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar movimentações';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Movimentações por produto
  const getMovementsByProduct = async (produtoId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/estoque/movimentacoes/${produtoId}`);
      setMovements(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar movimentações';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    stock,
    movements,
    loading,
    error,
    fetchStock,
    getStockByProduct,
    getLowStock,
    getOutOfStock,
    updateLocation,
    addStock,
    removeStock,
    fetchMovements,
    getMovementsByProduct,
  };
};
