import React from 'react';
import '../styles/Sidebar.css';

function Sidebar({ onTabChange }) {
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
      <button className="auth-button" onClick={() => alert('Авторизация/Выход')}>
        Войти/Выйти
      </button>
    </div>
  );
}

export default Sidebar;
