import { useState } from 'react';
import api from '../utils/api';
import { generateNotaFiscalPDF } from '../utils/notaFiscalGenerator';

export const useNotasFiscais = () => {
  const [notasFiscais, setNotasFiscais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Listar todas as notas fiscais
  const fetchNotasFiscais = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/notas-fiscais');
      setNotasFiscais(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao buscar notas fiscais');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar nota fiscal por ID
  const getNotaFiscalById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/notas-fiscais/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao buscar nota fiscal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar nota fiscal por venda
  const getNotaFiscalByVenda = async (vendaId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/notas-fiscais/venda/${vendaId}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao buscar nota fiscal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar nota fiscal por n�mero
  const getNotaFiscalByNumero = async (numero) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/notas-fiscais/numero/${numero}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao buscar nota fiscal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar nota fiscal por chave de acesso
  const getNotaFiscalByChave = async (chave) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/notas-fiscais/chave/${chave}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao buscar nota fiscal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar notas fiscais por per�odo
  const getNotasFiscaisByPeriod = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/notas-fiscais/periodo?data_inicio=${startDate}&data_fim=${endDate}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao buscar notas fiscais');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Gerar nota fiscal para uma venda
  const gerarNotaFiscal = async (vendaId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/notas-fiscais/gerar/${vendaId}`);
      await fetchNotasFiscais(); // Atualizar lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao gerar nota fiscal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Download XML da nota fiscal
  const downloadXML = async (notaFiscalId, numero) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/notas-fiscais/${notaFiscalId}/xml`, {
        responseType: 'blob'
      });

      // Criar link para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `nfe-${numero}.xml`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao baixar XML');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancelar nota fiscal
  const cancelarNotaFiscal = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/notas-fiscais/${id}`);
      await fetchNotasFiscais(); // Atualizar lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao cancelar nota fiscal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Gerar PDF da nota fiscal
  const downloadPDF = (sale) => {
    try {
      console.log('Hook useNotasFiscais - Gerando PDF com dados:', sale);
      generateNotaFiscalPDF(sale);
      console.log('Hook useNotasFiscais - PDF gerado com sucesso');
      return { success: true };
    } catch (err) {
      console.error('Hook useNotasFiscais - Erro ao gerar PDF:', err);
      setError('Erro ao gerar PDF da nota fiscal');
      throw err;
    }
  };

  return {
    notasFiscais,
    loading,
    error,
    fetchNotasFiscais,
    getNotaFiscalById,
    getNotaFiscalByVenda,
    getNotaFiscalByNumero,
    getNotaFiscalByChave,
    getNotasFiscaisByPeriod,
    gerarNotaFiscal,
    downloadXML,
    downloadPDF,
    cancelarNotaFiscal,
  };
};
