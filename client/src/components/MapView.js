import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext'; // Подключаем контекст авторизации
import '../styles/MapView.css';
import { useNavigate } from 'react-router-dom';



function MapView() {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [markerForm, setMarkerForm] = useState({ title: '', description: '', time: '' });
  const [clickedCoords, setClickedCoords] = useState(null);
  const [formPosition, setFormPosition] = useState({ top: 0, left: 0 });

  const { authToken, user } = useAuth(); // Получаем токен и пользователя из контекста
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем авторизацию пользователя
    if (!authToken) {
      navigate('/login');
      return;
    }

    // Загружаем Яндекс.Карты
    if (window.ymaps) {
      window.ymaps.ready(initMap);
    } else {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      script.async = true;
      script.onload = () => window.ymaps.ready(initMap);
      document.head.appendChild(script);
    }
  }, [authToken, navigate]);

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

  const fetchMarkers = async (myMap) => {
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        headers: {
          Authorization: `Bearer ${authToken}`, // Добавляем токен в заголовки
        },
      });
      const events = await response.json();
      setMarkers(events);

      myMap.geoObjects.removeAll();

      events.forEach((event) => {
        if (event.latitude && event.longitude) {
          const marker = new window.ymaps.Placemark(
            [event.latitude, event.longitude],
            {
              balloonContent: `
                <b>${event.theme_name}</b><br>
                ${event.location}<br>
                <i>${new Date(event.time).toLocaleString()}</i>
              `,
            },
            { preset: 'islands#redDotIcon' }
          );
          myMap.geoObjects.add(marker);
        }
      });
    } catch (error) {
      console.error('Ошибка загрузки маркеров:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setMarkerForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!markerForm.title || !markerForm.description || !markerForm.time) {
      alert('Пожалуйста, заполните все поля!');
      return;
    }

    const eventData = {
      time: markerForm.time,
      location: markerForm.description,
      theme: markerForm.title,
      count_people: 0,
      latitude: clickedCoords[0],
      longitude: clickedCoords[1],
      created_by: user?.email, // Пример использования данных пользователя
    };

    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // Передаём токен
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        alert('Мероприятие успешно добавлено!');
        fetchMarkers(map);
      } else {
        alert('Ошибка при добавлении мероприятия.');
      }
    } catch (error) {
      console.error('Ошибка при отправке данных на сервер:', error);
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
