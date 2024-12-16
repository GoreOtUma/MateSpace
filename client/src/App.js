import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './styles/App.css';

function App() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); // состояние для текущей вкладки

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login'); // Если токен отсутствует, перенаправляем на страницу входа
    }
  }, [navigate]);

  return (
    <div className="app">
      {activeTab !== 'login' && <Sidebar onTabChange={setActiveTab} />} {/* Скрыть сайдбар для логина */}
      <MainContent activeTab={activeTab} />
    </div>
  );
}

export default App;
