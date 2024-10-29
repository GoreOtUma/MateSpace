import React from 'react';
import Profile from './Profile';
import Search from './Search';
import Messages from './Messages';
import '../styles/MainContent.css';

function MainContent({ activeTab }) {
  return (
    <div className="main-content">
      {activeTab === 'profile' && <Profile />}
      {activeTab === 'search' && <Search />}
      {activeTab === 'map' && <div><h2>Карта</h2><p>Здесь будет отображена карта.</p></div>}
      {activeTab === 'messages' && <Messages />} {}
    </div>
  );
}

export default MainContent;
