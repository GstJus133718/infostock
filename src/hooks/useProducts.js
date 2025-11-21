import { useState, useEffect } from 'react';
import api from '../utils/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar todos os produtos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/produtos');
      setProducts(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar produtos';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar produto por ID
  const getProductById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/produtos/${id}`);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar produto';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar produto por SKU
  const getProductBySKU = async (sku) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/produtos/sku/${sku}`);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar produto';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Pesquisar produtos
  const searchProducts = async (query) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/produtos/pesquisar?q=${query}`);
      setProducts(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao pesquisar produtos';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Filtrar por categoria
  const getProductsByCategory = async (categoria) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/produtos/categoria/${categoria}`);
      setProducts(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar produtos';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Filtrar por marca
  const getProductsByBrand = async (marca) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/produtos/marca/${marca}`);
      setProducts(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar produtos';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Filtrar por faixa de preço
  const getProductsByPriceRange = async (min, max) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/produtos/faixa-preco?min=${min}&max=${max}`);
      setProducts(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar produtos';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Criar produto (ADMIN ou GERENTE)
  const createProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/produtos', productData);
      await fetchProducts(); // Atualiza a lista
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao criar produto';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Atualizar produto (ADMIN ou GERENTE)
  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/produtos/${id}`, productData);
      await fetchProducts(); // Atualiza a lista
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao atualizar produto';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Deletar produto (ADMIN)
  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/produtos/${id}`);
      await fetchProducts(); // Atualiza a lista
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao deletar produto';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProductById,
    getProductBySKU,
    searchProducts,
    getProductsByCategory,
    getProductsByBrand,
    getProductsByPriceRange,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
