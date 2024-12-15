import React, { useEffect, useState } from 'react';
import '../styles/MapView.css';

function MapView() {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false); // Для отображения формы
  const [markerForm, setMarkerForm] = useState({ title: '', description: '', time: '' }); // Данные формы
  const [clickedCoords, setClickedCoords] = useState(null); // Координаты клика
  const [formPosition, setFormPosition] = useState({ top: 0, left: 0 }); // Позиция формы
  const [user, setUser] = useState(null); // Данные авторизованного пользователя

  useEffect(() => {
    // Загружаем Яндекс.Карты, если они не загружены
    if (window.ymaps) {
      window.ymaps.ready(initMap);
    } else {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      script.async = true;
      script.onload = () => window.ymaps.ready(initMap);
      document.head.appendChild(script);
    }

    // Проверяем авторизован ли пользователь (например, через токен в localStorage)
    const loggedInUser = localStorage.getItem('user'); // пример получения данных о пользователе
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const initMap = () => {
    const myMap = new window.ymaps.Map('map', {
      center: [56.740005, 37.225414],
      zoom: 14,
    });

    setMap(myMap);
    fetchMarkers(myMap);

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

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleString('ru-RU', options);
  };

  const fetchMarkers = async (myMap) => {
    try {
      const response = await fetch('http://localhost:5000/api/events');
      const events = await response.json();
      console.log('Загруженные мероприятия:', events);

      setMarkers(events);

      // Удаляем предыдущие маркеры с карты перед добавлением новых
      myMap.geoObjects.removeAll();

      // Добавляем маркеры на карту
      events.forEach((event) => {
        if (event.latitude && event.longitude) {
          const formattedTime = formatDate(event.time); // Форматируем время

          const marker = new window.ymaps.Placemark(
            [event.latitude, event.longitude],
            {
              balloonContent: `
                <b>${event.theme_name}</b><br>
                ${event.location}<br>
                <i>${formattedTime}</i>
              `,
            },
            { preset: 'islands#redDotIcon' }
          );

          myMap.geoObjects.add(marker);
        } else {
          console.warn('Мероприятие без координат:', event);
        }
      });
    } catch (error) {
      console.error('Ошибка загрузки маркеров:', error);
    }
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

    if (!markerForm.title || !markerForm.description || !markerForm.time) {
      alert('Пожалуйста, заполните все поля!');
      return;
    }

    const eventData = {
      time: markerForm.time, // Время из формы
      location: markerForm.description, // Используем описание как локацию
      theme: markerForm.title, // Название события
      count_people: 0, // Значение по умолчанию
      latitude: clickedCoords[0], // Координаты широты
      longitude: clickedCoords[1], // Координаты долготы
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
        fetchMarkers(map); // Обновляем маркеры
      } else {
        alert('Ошибка при добавлении мероприятия.');
      }
    } catch (error) {
      console.error('Ошибка при отправке данных на сервер:', error);
      alert('Ошибка при отправке данных на сервер.');
    }

    setIsFormVisible(false);
    setMarkerForm({ title: '', description: '', time: '' });
  };

  return (
    <div className="map-tab">
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
            <div>
              <label>Время:</label>
              <input
                type="datetime-local"
                name="time"
                value={markerForm.time}
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
