import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import LogoInfostock from '../../assets/logotipo_infostock.png';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
    setIsLoading(true);
    setError('');
    
    // Validação simples
    if (!formData.username || !formData.password) {
      setError('Por favor, preencha todos os campos');
      setIsLoading(false);
      return;
    }
    
    // Simular chamada de API
    setTimeout(() => {
      console.log('Login attempt:', formData);
      setIsLoading(false);
      // Navegar para a home após login bem-sucedido
      navigate('/home');
    }, 1500);
  };

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
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
              <p className="text-danger-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Campo Usuário */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-neutral-700 mb-2">
                Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="Digite seu usuário"
                  value={formData.username}
                  onChange={handleInputChange}
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
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-neutral-50 rounded-r-lg transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Lembrar-me e Esqueceu senha */}
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

              <div className="text-sm">
                <a 
                  href="#" 
                  className="font-semibold text-primary-500 hover:text-primary-600 transition-colors duration-200"
                >
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            {/* Botão de Login */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
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
        </div>
      </div>
    </div>
  );
};

export default Login;