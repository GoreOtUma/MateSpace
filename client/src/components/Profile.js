import React, { useEffect, useState } from 'react';
import '../styles/Profile.css';
import profilePhoto from '../img/1712.jpg';
import { useAuth } from '../AuthContext';

function Profile() {
  const { authToken } = useAuth();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});

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
          setEditedUser(data);  // Заполняем данные для редактирования
        } else {
          console.error('Ошибка при получении данных профиля');
        }
      } catch (error) {
        console.error('Ошибка подключения к серверу:', error);
      }
    }

    if (authToken) {
      fetchUserProfile();
    }
  }, [authToken]);

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
      </div>
    </div>
  );
}

export default Profile;
