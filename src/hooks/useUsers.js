import { useState } from 'react';
import api from '../utils/api';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar todos os usuários (ADMIN)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/usuarios');
      setUsers(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar usuários';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar usuário por ID (ADMIN)
  const getUserById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/usuarios/${id}`);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar usuário';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Criar usuário (ADMIN)
  const createUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/usuarios', userData);
      await fetchUsers(); // Atualiza a lista
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao criar usuário';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Atualizar usuário (ADMIN)
  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/usuarios/${id}`, userData);
      await fetchUsers(); // Atualiza a lista
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao atualizar usuário';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Deletar usuário (ADMIN)
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/usuarios/${id}`);
      await fetchUsers(); // Atualiza a lista
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao deletar usuário';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  };
};
