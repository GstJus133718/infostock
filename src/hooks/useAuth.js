import { useState } from 'react';
import api from '../utils/api';
import { saveAuth, clearAuth, getUser } from '../utils/auth';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(getUser());

  const login = async (email, senha) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/login', { email, senha });
      const { token, usuario } = response.data;

      saveAuth(token, usuario);
      setUser(usuario);

      return { success: true, user: usuario };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao fazer login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (nome, email, senha, perfil = 'VENDEDOR') => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/registro', { nome, email, senha, perfil });
      const { token, usuario } = response.data;

      saveAuth(token, usuario);
      setUser(usuario);

      return { success: true, user: usuario };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao registrar usuário';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    window.location.href = '/login';
  };

  const alterarSenha = async (senhaAtual, novaSenha) => {
    try {
      setLoading(true);
      setError(null);

      await api.post('/usuarios/alterar-senha', {
        senha_atual: senhaAtual,
        nova_senha: novaSenha,
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao alterar senha';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    alterarSenha,
  };
};
