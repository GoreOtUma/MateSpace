import React, { useEffect, useState } from 'react';
import '../styles/MapView.css';

function MapView() {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);  // Состояние для отображения формы
  const [markerForm, setMarkerForm] = useState({ title: '', description: '' });  // Данные формы
  const [clickedCoords, setClickedCoords] = useState(null);  // Координаты клика
  const [formPosition, setFormPosition] = useState({ top: 0, left: 0 });  // Позиция формы

  useEffect(() => {
    // Загружаем Яндекс.Карты, если они не загружены
    if (window.ymaps) {
      window.ymaps.ready(initMap);
    } else {
      const script = document.createElement('script');
      script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
      script.async = true;
      script.onload = () => window.ymaps.ready(initMap);  // Инициализируем карту, когда скрипт загрузится
      document.head.appendChild(script);
    }
  }, []);

  const initMap = () => {
    console.log("Инициализация карты...");
    // Инициализируем карту
    const myMap = new window.ymaps.Map('map', {
      center: [56.740005, 37.225414],  // Центр карты
      zoom: 14,
    });

    setMap(myMap);  // Сохраняем объект карты в состояние

    // Обработчик клика по карте
    myMap.events.add('click', (e) => {
      const coords = e.get('coords');
      console.log('Координаты клика:', coords);

      // Сохраняем координаты клика
      setClickedCoords(coords);

      // Рассчитываем позицию формы относительно экрана
      const mapContainer = document.querySelector('.map-container');
      const mapRect = mapContainer.getBoundingClientRect();
      const offsetX = e.get('pageX') - mapRect.left;
      const offsetY = e.get('pageY') - mapRect.top;

      setFormPosition({ top: offsetY, left: offsetX });  // Устанавливаем позицию формы
      setIsFormVisible(true);  // Показываем форму для ввода данных
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setMarkerForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!markerForm.title || !markerForm.description) {
      alert('Пожалуйста, заполните все поля!');
      return;
    }

    // Создаем новый маркер с введенными данными
    const newMarker = {
      coords: clickedCoords,
      title: markerForm.title,
      description: markerForm.description,
    };

    const marker = new window.ymaps.Placemark(clickedCoords, {
      balloonContentHeader: newMarker.title,
      balloonContentBody: newMarker.description,
    });

    // Добавляем маркер на карту
    map.geoObjects.add(marker);
    console.log("Маркер добавлен на карту");

    // Сохраняем маркер в состояние
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);

    // Скрываем форму после отправки
    setIsFormVisible(false);
    setMarkerForm({ title: '', description: '' });  // Очищаем поля формы
  };

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
        <div id="map" style={{ width: '100%', height: '100%', borderRadius: '10px' }}></div>
      </div>

      {/* Форма для добавления маркера, позиционированная по координатам клика */}
      {isFormVisible && (
        <div
          className="marker-form"
          style={{
            position: 'absolute',
            top: formPosition.top + 'px',
            left: formPosition.left + 'px',
            transform: 'translate(-50%, -50%)',  // Центрируем форму относительно клика
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
          }}
        >
          <h3>Добавить событие</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Название:</label>
              <input
                type="text"
                name="title"
                value={markerForm.title}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label>Описание:</label>
              <textarea
                name="description"
                value={markerForm.description}
                onChange={handleFormChange}
                required
              />
            </div>
            <button type="submit">Добавить маркер</button>
          </form>
        </div>
      )}

      {/* Отображение информации о событии */}
      {markers.length > 0 && (
        <div className="event-details">
          <h3>События на карте:</h3>
          <ul>
            {markers.map((marker, index) => (
              <li key={index}>
                <strong>{marker.title}</strong>: {marker.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MapView;
