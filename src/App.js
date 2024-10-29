import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('profile'); // состояние для текущей вкладки

  return (
    <div className="app">
      <Sidebar onTabChange={setActiveTab} /> {/* передаём функцию для изменения вкладки */}
      <MainContent activeTab={activeTab} /> {/* передаём текущую вкладку */}
    </div>
  );
}

export default App;
