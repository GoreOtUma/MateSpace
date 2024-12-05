// src/components/MainContent.js
import React from 'react';
import Profile from './Profile';
import Search from './Search';
import MapView from './MapView';
import Messages from './Messages';
import Login from './Login';

function MainContent({ activeTab }) {
  return (
    <div className="main-content">
      {activeTab === 'profile' && <Profile />}
      {activeTab === 'search' && <Search />}
      {activeTab === 'map' && <MapView />} {/* Новая вкладка "Карта" */}
      {activeTab === 'messages' && <Messages />}
      {activeTab === 'login' && <Login />} {/* Страница для входа */}
    </div>
  );
}

export default MainContent;
