import React, { createContext, useContext, useState, useEffect } from 'react';

// Создаём контекст
const AuthContext = createContext();

// Поставщик авторизации
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const login = (token) => {
    setAuthToken(token);
    localStorage.setItem('authToken', token); // Сохраняем токен
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('authToken');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      login(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста
export const useAuth = () => {
  return useContext(AuthContext);
};
