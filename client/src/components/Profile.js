import React, { useState } from 'react';
import '../styles/Profile.css';
import profilePhoto from '../img/1712.jpg';

function Profile() {
  const [user, setUser] = useState({
    name: 'Мария Гапиенко',
    gender: 'Женский',
    birthDate: '17.01.2004',
    city: 'Конаково',
    hobbies: ['Чтение', 'Игра на гитаре', 'Плавание'],
    about: 'Привет! Я Маша, я была очень красивой девочкой в школе, но после того как я выбрала не того и окончила школу, моя внешность стала так себе :(',
    photo: profilePhoto,
  });

  function handleEditProfile() {
    alert("Функция редактирования профиля пока не реализована.");
  }

  return (
    <div className="profile">
      <div className="profile-photo">
        <img src={user.photo} alt="Профиль" />
        <button onClick={handleEditProfile} className="edit-button">Редактировать профиль</button>
      </div>
      <div className="profile-info">
        <h2>{user.name}</h2>
        <p><strong>Пол:</strong> {user.gender}</p>
        <p><strong>Дата рождения:</strong> {user.birthDate}</p>
        <p><strong>Город:</strong> {user.city}</p>
        <div>
          <strong>Хобби:</strong>
          <ul>
            {user.hobbies.map((hobby, index) => (
              <li key={index}>{hobby}</li>
            ))}
          </ul>
        </div>
        <div className="about">
          <strong>О себе:</strong>
          <p>{user.about}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
