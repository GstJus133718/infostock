import { useState } from 'react';
import api from '../utils/api';

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar todos os clientes
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/clientes');
      setClients(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar clientes';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar clientes ativos
  const fetchActiveClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/clientes/ativos');
      setClients(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar clientes';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar cliente por ID
  const getClientById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/clientes/${id}`);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar cliente por CPF
  const getClientByCPF = async (cpf) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/clientes/cpf/${cpf}`);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar cliente por CNPJ
  const getClientByCNPJ = async (cnpj) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/clientes/cnpj/${cnpj}`);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar clientes por cidade
  const getClientsByCity = async (cidade) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/clientes/cidade/${cidade}`);
      setClients(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar clientes';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar clientes por estado
  const getClientsByState = async (estado) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/clientes/estado/${estado}`);
      setClients(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar clientes';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Pesquisar clientes
  const searchClients = async (query) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/clientes/pesquisar?q=${query}`);
      setClients(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao pesquisar clientes';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Criar cliente
  const createClient = async (clientData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/clientes', clientData);
      await fetchClients(); // Atualiza a lista
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao criar cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Atualizar cliente
  const updateClient = async (id, clientData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/clientes/${id}`, clientData);
      await fetchClients(); // Atualiza a lista
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao atualizar cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Deletar cliente (ADMIN)
  const deleteClient = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/clientes/${id}`);
      await fetchClients(); // Atualiza a lista
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao deletar cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    clients,
    loading,
    error,
    fetchClients,
    fetchActiveClients,
    getClientById,
    getClientByCPF,
    getClientByCNPJ,
    getClientsByCity,
    getClientsByState,
    searchClients,
    createClient,
    updateClient,
    deleteClient,
  };
};
