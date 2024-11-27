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
        <iframe
          src="https://yandex.ru/map-widget/v1/?ll=37.225414%2C56.740005&z=14"
          frameBorder="0"
          title="Map"
          style={{ width: '100%', height: '100%', borderRadius: '10px' }}
        ></iframe>
      </div>
    </div>
  );
}

export default MapView;
