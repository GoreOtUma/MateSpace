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
    const myMap = new window.ymaps.Map('map', {
      center: [56.740005, 37.225414],
      zoom: 14,
    });

    setMap(myMap);

    myMap.events.add('click', (e) => {
      const coords = e.get('coords');
      setClickedCoords(coords);

      const mapContainer = document.querySelector('.map-container');
      const mapRect = mapContainer.getBoundingClientRect();
      const offsetX = e.get('pageX') - mapRect.left;
      const offsetY = e.get('pageY') - mapRect.top;

      setFormPosition({ top: offsetY, left: offsetX });
      setIsFormVisible(true);
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setMarkerForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!markerForm.title || !markerForm.description) {
      alert('Пожалуйста, заполните все поля!');
      return;
    }
  
    const eventData = {
      time: new Date().toISOString(), // Текущая временная метка
      location: markerForm.description, // Используем описание как локацию
      theme: markerForm.title, // Название события
      count_people: 0, // Значение по умолчанию
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
  
      if (response.ok) {
        alert('Мероприятие успешно добавлено!');
      } else {
        alert('Ошибка при добавлении мероприятия.');
      }
    } catch (error) {
      console.error('Ошибка при отправке данных на сервер:', error);
      alert('Ошибка при отправке данных на сервер.');
    }
  
    setIsFormVisible(false);
    setMarkerForm({ title: '', description: '' });
  };
  

  return (
    <div className="map-tab">
      <div className="map-buttons">
        <button>Поиск событий</button>
        <div className="filter">
          <span>Фильтр</span>
        </div>
      </div>
      <div className="map-container">
        <div id="map" style={{ width: '100%', height: '100%', borderRadius: '10px' }}></div>
      </div>

      {isFormVisible && (
        <div
          className="marker-form"
          style={{
            position: 'absolute',
            top: formPosition.top + 'px',
            left: formPosition.left + 'px',
            transform: 'translate(-50%, -50%)',
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
    </div>
  );
}

export default MapView;
