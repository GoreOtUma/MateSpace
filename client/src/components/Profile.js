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
  const [profilePhoto, setProfilePhoto] = useState(null);

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

    if (authToken) {
      fetchUserProfile();
      fetchHobbies();
      fetchUserHobbies();
    }
  }, [authToken]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePhoto(file);
    }
  };

  const handleHobbyChange = (hobbyId) => {
    setSelectedHobbies((prevSelected) =>
      prevSelected.includes(hobbyId)
        ? prevSelected.filter((id) => id !== hobbyId)
        : [...prevSelected, hobbyId]
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
        setUser((prevUser) => ({
          ...prevUser,
          hobbies: selectedHobbies,
        }));
        setIsEditing(false);
      } else {
        console.error('Ошибка при сохранении хобби');
      }
    } catch (error) {
      console.error('Ошибка при сохранении хобби:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append('name', editedUser.name);
    formData.append('gender', editedUser.gender);
    formData.append('data_birthday', editedUser.data_birthday);
    formData.append('city', editedUser.city);
    formData.append('comments', editedUser.comments);
    if (profilePhoto) {
      formData.append('profilePhoto', profilePhoto);
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
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
        {/* Проверяем наличие фотографии в данных пользователя */}
        {user.link_ph ? (
          <img src={`data:image/jpeg;base64,${user.link_ph}`} alt="Профиль" />
        ) : (
          <p>Фото не загружено</p>
        )}
        <button onClick={() => setIsEditing(true)} className="edit-button">
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
            <label>
              Фото:
              <input
                type="file"
                name="profilePhoto"
                onChange={handleFileChange}
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

        <div className="hobbies-section">
          {isEditing ? (
            <>
              <strong>Выберите хобби:</strong>
              <div className="hobbies-list">
                {availableHobbies.length > 0 ? (
                  availableHobbies.map((hobby) => (
                    <label key={hobby.id}>
                      <input
                        type="checkbox"
                        checked={selectedHobbies.includes(hobby.h_name)}
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
            </>
          ) : (
            <div className="hobbies-display">
              <strong>Хобби:</strong>
              <ul>
                {user.hobbies && user.hobbies.length > 0 ? (
                  user.hobbies.map((hobby, index) => <li key={index}>{hobby}</li>)
                ) : (
                  <li>Хобби не указаны</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
