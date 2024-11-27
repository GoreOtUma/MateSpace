import React from 'react';
import '../styles/MapView.css';

function MapView() {
  return (
    <div className="map-tab">
      <div className="map-buttons">
        <button>Добавить событие на карту</button>
        <button>Поиск событий</button>
        <div className="filter">
          <span>Фильтр</span>
        </div>
      </div>
      <div className="map-container">
        {/* Здесь вставьте компонент или iframe карты */}
        <iframe
          src="https://yandex.ru/map-widget/v1/-/CCUBc6yPzA"
          frameBorder="0"
          title="Map"
          style={{ width: '100%', height: '100%', borderRadius: '10px' }}
        ></iframe>
      </div>
    </div>
  );
}

export default MapView;
