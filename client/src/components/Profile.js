import React, { useEffect, useState } from 'react';
import '../styles/Profile.css';
import profilePhoto from '../img/1712.jpg';
import { useAuth } from '../AuthContext';

function Profile() {
  const { authToken } = useAuth();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [availableHobbies, setAvailableHobbies] = useState([]);
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch(`http://localhost:5000/api/profile`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setEditedUser(data);  
        } else {
          console.error('Ошибка при получении данных профиля');
        }
      } catch (error) {
        console.error('Ошибка подключения к серверу:', error);
      }
    }

    async function fetchHobbies() {
      try {
        const response = await fetch(`http://localhost:5000/api/hobbies`);
        if (response.ok) {
          const data = await response.json();
          setAvailableHobbies(data || []);
        } else {
          console.error('Ошибка при загрузке списка хобби');
        }
      } catch (error) {
        console.error('Ошибка подключения к серверу:', error);
      }
    }
  
    async function fetchUserHobbies() {
      try {
        const response = await fetch(`http://localhost:5000/api/profile/user_hobbies`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
  
        if (response.ok) {
          const userHobbies = await response.json();
          setUser((prevUser) => ({
            ...prevUser,
            hobbies: userHobbies, // Добавляем хобби в данные пользователя
          }));
          setSelectedHobbies(userHobbies); // Обновляем состояние выбранных хобби
        } else {
          console.error('Ошибка при загрузке хобби пользователя');
        }
      } catch (error) {
        console.error('Ошибка подключения к серверу:', error);
      }
    }

    async function fetchProfileAndHobbies() {
      try {
        const [profileResponse, hobbiesResponse, userHobbiesResponse] = await Promise.all([
          fetch(`http://localhost:5000/api/profile`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          fetch(`http://localhost:5000/api/hobbies`),
          fetch(`http://localhost:5000/api/profile/user_hobbies`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);
  
        if (profileResponse.ok && hobbiesResponse.ok && userHobbiesResponse.ok) {
          const userProfile = await profileResponse.json();
          const availableHobbiesData = await hobbiesResponse.json();
          const userHobbiesData = await userHobbiesResponse.json();
  
          // Обновляем состояние пользователя и хобби
          setUser({ ...userProfile, hobbies: userHobbiesData });
          setAvailableHobbies(availableHobbiesData);
          setSelectedHobbies(userHobbiesData);
        } else {
          console.error('Ошибка при загрузке данных профиля или хобби');
        }
      } catch (error) {
        console.error('Ошибка подключения к серверу:', error);
      }
    }
    
    if (authToken) {
      fetchUserProfile();
      fetchProfileAndHobbies();
    }
  }, [authToken]);

  const handleHobbyChange = (hobbyId) => {
    setSelectedHobbies((prevSelected) =>
      prevSelected.includes(hobbyId)
        ? prevSelected.filter((id) => id !== hobbyId) // Удалить, если уже выбрано
        : [...prevSelected, hobbyId] // Добавить, если не выбрано
    );
  };
  
  const saveHobbies = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/profile/hobbies`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ hobbies: selectedHobbies }),
      });
  
      if (response.ok) {
        console.log('Хобби успешно обновлены');
  
        // Обновляем хобби на странице и закрываем окно редактирования
        setUser((prevUser) => ({
          ...prevUser,
          hobbies: selectedHobbies, // Добавляем выбранные хобби в данные пользователя
        }));
  
        setIsEditing(false); // Закрываем режим редактирования
      } else {
        console.error('Ошибка при сохранении хобби');
      }
    } catch (error) {
      console.error('Ошибка при сохранении хобби:', error);
    }
  };
  
  
  useEffect(() => {
    console.log('availableHobbies:', availableHobbies);
  }, [availableHobbies]);
  
  // Функция для изменения данных в инпутах
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Функция для отправки изменённых данных на сервер
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/profile`, {
        method: 'PUT', // Используем PUT для обновления данных
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data); // Обновляем отображаемые данные
        setIsEditing(false); // Закрываем режим редактирования
      } else {
        console.error('Ошибка при сохранении изменений');
      }
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
    }
  };

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="profile">
      <div className="profile-photo">
        <img src={user.photo || profilePhoto} alt="Профиль" />
        <button
          onClick={() => setIsEditing(true)} // Открытие режима редактирования
          className="edit-button"
        >
          Редактировать профиль
        </button>
      </div>
      <div className="profile-info">
        {isEditing ? (
          <div className="edit-form">
            <label>
              Имя:
              <input
                type="text"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Пол:
              <input
                type="text"
                name="gender"
                value={editedUser.gender}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Дата рождения:
              <input
                type="date"
                name="data_birthday"
                value={editedUser.data_birthday}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Город:
              <input
                type="text"
                name="city"
                value={editedUser.city}
                onChange={handleInputChange}
              />
            </label>
            <label>
              О себе:
              <textarea
                name="comments"
                value={editedUser.comments}
                onChange={handleInputChange}
              />
            </label>
            <button onClick={handleSaveChanges}>Сохранить изменения</button>
            <button onClick={() => setIsEditing(false)}>Отмена</button>
          </div>
        ) : (
          <>
            <h2>{user.name}</h2>
            <p><strong>Пол:</strong> {user.gender}</p>
            <p><strong>Дата рождения:</strong> {new Date(user.data_birthday).toLocaleDateString()}</p>
            <p><strong>Город:</strong> {user.city}</p>
            <div className="about">
              <strong>О себе:</strong>
              <p>{user.comments}</p>
            </div>
          </>
        )}
        {!isEditing && user.hobbies && (
          <div className="hobbies-display">
            <strong>Хобби:</strong>
            <ul>
              {user.hobbies.length > 0 ? (
                user.hobbies.map((hobby, index) => <li key={index}>{hobby}</li>)
              ) : (
                <li>Хобби не указаны</li>
              )}
            </ul>
          </div>
        )}
        {isEditing && (
          <div className="hobbies-section">
            <strong>Выберите хобби:</strong>
            <div className="hobbies-list">
            {Array.isArray(availableHobbies) && availableHobbies.length > 0 ? (
          availableHobbies.map((hobby) => (
            <label key={hobby.id}>
              <input
                type="checkbox"
                checked={selectedHobbies.includes(hobby.h_name)} // Match by h_name
                onChange={() => handleHobbyChange(hobby.h_name)}
              />
              {hobby.h_name}
            </label>
          ))
        ) : (
          <p>Хобби не загружены</p>
        )}
        </div>
    <button onClick={saveHobbies}>Сохранить хобби</button>
  </div>
)}

      </div>
    </div>
  );
}

export default Profile;
