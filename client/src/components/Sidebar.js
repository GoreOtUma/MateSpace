import React from 'react';
import '../styles/Sidebar.css';
import { useNavigate } from 'react-router-dom';

function Sidebar({ onTabChange }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Удаляем токен
    navigate('/login'); // Перенаправляем на страницу входа
  };

  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li onClick={() => onTabChange('profile')}>Профиль</li>
          <li onClick={() => onTabChange('search')}>Поиск</li>
          <li onClick={() => onTabChange('map')}>Карта</li>
          <li onClick={() => onTabChange('messages')}>Сообщения</li>
        </ul>
      </nav>
      <button className="auth-button" onClick={handleLogout}>
        Выйти
      </button>
    </div>
  );
}

export default Sidebar;
