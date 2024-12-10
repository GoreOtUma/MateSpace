import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './styles/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('profile'); // состояние для текущей вкладки

  return (
    <div className="app">
      {activeTab !== 'login' && <Sidebar onTabChange={setActiveTab} />} {/* Скрыть сайдбар для логина */}
      <MainContent activeTab={activeTab} />
    </div>
  );
}

export default App;
