import { useState } from 'react';
import api from '../utils/api';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar todos os fornecedores
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/fornecedores');
      setSuppliers(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar fornecedores';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar fornecedores ativos
  const fetchActiveSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/fornecedores/ativos');
      setSuppliers(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar fornecedores';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar fornecedor por ID
  const getSupplierById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/fornecedores/${id}`);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar fornecedor';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar fornecedor por CNPJ
  const getSupplierByCNPJ = async (cnpj) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/fornecedores/cnpj/${cnpj}`);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar fornecedor';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Criar fornecedor (ADMIN ou GERENTE)
  const createSupplier = async (supplierData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/fornecedores', supplierData);
      await fetchSuppliers(); // Atualiza a lista
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao criar fornecedor';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Atualizar fornecedor (ADMIN ou GERENTE)
  const updateSupplier = async (id, supplierData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/fornecedores/${id}`, supplierData);
      await fetchSuppliers(); // Atualiza a lista
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao atualizar fornecedor';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Deletar fornecedor (ADMIN)
  const deleteSupplier = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/fornecedores/${id}`);
      await fetchSuppliers(); // Atualiza a lista
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao deletar fornecedor';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Vincular produto ao fornecedor (ADMIN ou GERENTE)
  const linkProduct = async (fornecedorId, produtoId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post(`/fornecedores/${fornecedorId}/produtos`, {
        produto_id: produtoId,
      });
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao vincular produto';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Desvincular produto do fornecedor (ADMIN ou GERENTE)
  const unlinkProduct = async (fornecedorId, produtoId) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/fornecedores/${fornecedorId}/produtos/${produtoId}`);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao desvincular produto';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    suppliers,
    loading,
    error,
    fetchSuppliers,
    fetchActiveSuppliers,
    getSupplierById,
    getSupplierByCNPJ,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    linkProduct,
    unlinkProduct,
  };
};
