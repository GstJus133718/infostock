// Gerenciamento de autenticação e token

export const saveAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const logout = () => {
  clearAuth();
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const hasPermission = (requiredPermissions) => {
  const user = getUser();
  if (!user || !user.perfil) return false;

  // Se requiredPermissions for um array, verifica se o perfil está nele
  if (Array.isArray(requiredPermissions)) {
    return requiredPermissions.includes(user.perfil);
  }

  // Se for uma string, verifica se é igual ao perfil
  return user.perfil === requiredPermissions;
};

export const isAdmin = () => {
  const user = getUser();
  return user?.perfil === 'ADMIN';
};

export const isGerente = () => {
  const user = getUser();
  return user?.perfil === 'GERENTE' || user?.perfil === 'ADMIN';
};

export const isVendedor = () => {
  const user = getUser();
  return user?.perfil === 'VENDEDOR';
};
