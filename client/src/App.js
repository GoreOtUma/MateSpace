import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './styles/App.css';

function App() {
  const { authToken } = useAuth(); // Получаем токен из контекста
  const [activeTab, setActiveTab] = useState('profile'); // Состояние для текущей вкладки

  // Если пользователь не авторизован, перенаправляем на страницу логина
  if (!authToken) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app">
      {/* Sidebar будет скрыт только при необходимости */}
      <Sidebar onTabChange={setActiveTab} />
      <MainContent activeTab={activeTab} />
    </div>
  );
}

export default App;
