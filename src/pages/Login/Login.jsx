import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import LogoInfostock from '../../assets/logotipo_infostock.png';
import { useAuth } from '../../hooks/useAuth';
import { isAuthenticated } from '../../utils/auth';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/home');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro quando usuário começar a digitar
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validação simples
    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, insira um email válido');
      return;
    }

    // Fazer login
    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Redirecionar para home após login bem-sucedido
      navigate('/home');
    } else {
      setError(result.error);
    }
  };

  const displayError = error || authError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 via-blue-light to-primary-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Card Principal */}
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl border border-neutral-200">
          {/* Logo Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-28 w-28 flex items-center justify-center mb-6">
              <img
                src={LogoInfostock}
                alt="Logotipo InfoStock"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Bem-vindo de volta!
            </h2>
            <p className="text-sm text-neutral-600">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>

          {/* Mensagem de Erro */}
          {displayError && (
            <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg animate-shake">
              <p className="text-danger-600 text-sm font-medium">{displayError}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="Digite seu email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-neutral-50 rounded-r-lg transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Lembrar-me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-neutral-300 rounded transition-colors duration-200"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700 font-medium">
                  Lembrar-me
                </label>
              </div>
            </div>

            {/* Botão de Login */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Entrando...
                  </div>
                ) : (
                  'Entrar no Sistema'
                )}
              </button>
            </div>
          </form>

          {/* Informações de Teste */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-semibold text-blue-800 mb-2">Usuários de Teste:</p>
            <div className="space-y-1 text-xs text-blue-700">
              <p><strong>Admin:</strong> admin@infostock.com / admin123</p>
              <p><strong>Gerente:</strong> gerente@infostock.com / admin123</p>
              <p><strong>Vendedor:</strong> vendedor@infostock.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
