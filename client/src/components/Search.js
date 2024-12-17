import React, { useState, useEffect } from 'react';
import '../styles/Search.css';
import axios from 'axios';

function Search() {
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    interests: '',
    location: '',
    gender: '',
    age: '',
  });

  useEffect(() => {
    const fetchProfiles = async () => {
      const authToken = localStorage.getItem('authToken');
      try {
        const response = await axios.get('http://localhost:5000/profiles', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setProfiles(response.data);
        setFilteredProfiles(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке анкет:', error);
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFilterToggle = () => {
    setFilterOpen(!isFilterOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const { interests, location, gender, age } = filters;
  
    const filtered = profiles.filter((profile) => {
      // Проверка интересов
      const matchesInterests =
        !interests || 
        (profile.hobby &&
          profile.hobby
            .replace(/{|}/g, '') // Удаляем скобки
            .split(',')
            .some((hobby) =>
              hobby.toLowerCase().includes(interests.toLowerCase().trim())
            ));
  
      // Проверка местоположения
      const matchesLocation =
        !location || 
        (profile.city && profile.city.toLowerCase().includes(location.toLowerCase().trim()));
  
      // Проверка пола
      const matchesGender =
        !gender || 
        (profile.pol && profile.pol.toLowerCase() === gender.toLowerCase().trim());
  
      // Проверка возраста
      const matchesAge = !age || (profile.data_birthday && calculateAge(profile.data_birthday) === parseInt(age, 10));
  
      return matchesInterests && matchesLocation && matchesGender && matchesAge;
    });
  
    console.log('Отфильтрованные анкеты:', filtered); // Для отладки
    setFilteredProfiles(filtered);
    setFilterOpen(false);
  };

  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs); // Используем разницу времени
    return Math.abs(ageDate.getUTCFullYear() - 1970); // Возраст в годах
  };

  const handleResetFilters = () => {
    setFilters({
      interests: '',
      location: '',
      gender: '',
      age: '',
    });
    setFilteredProfiles(profiles); // Сбрасываем фильтрацию
  };

  return (
    <div className="search">
    <div className="searchParams">
      <button className="filter-button" onClick={handleFilterToggle}>
        Фильтры
      </button>
    </div>

    {isFilterOpen && (
      <div className="filter-modal">
        <h2>Фильтры</h2>
        <form onSubmit={handleSearch}>
          <label>
            Хобби:
            <input
              type="text"
              name="interests"
              value={filters.interests}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Местоположение:
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Пол:
            <input
              type="text"
              name="gender"
              value={filters.gender}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Возраст:
            <input
              type="number"
              name="age"
              value={filters.age}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit" className="search-submit">
            Найти анкеты
          </button>
          <button onClick={handleFilterToggle} className="close-button">
            Закрыть
          </button>
        </form>
      </div>
    )}

    <div className="search-results">
      {loading ? (
        <p>Загрузка...</p>
      ) : filteredProfiles.length > 0 ? (
        filteredProfiles.map((profile) => (
          <div key={profile.email} className="profile-card">
            {profile.link_ph && typeof profile.link_ph === 'string' ? (
      <img
        src={`data:image/jpeg;base64,${profile.link_ph}`}
        alt={`Фото ${profile.name}`}
      />
    ) : (
      <p></p>
    )}

            <h3>{profile.name}</h3>
            <p>{profile.comments || ''}</p>
            <p><strong>Хобби:</strong></p>
            <ul>
              {profile.hobby ? profile.hobby
                .replace(/{|}/g, '') // Удаляем фигурные скобки
                .split(',') // Разделяем по запятой
                .map((hobby, index) => (
                  <li key={index}>{hobby.trim()}</li> // Обрезаем пробелы
                )) : <li>Не указано</li>}
            </ul>
            <p><strong>Дата рождения:</strong> {profile.data_birthday.split('T')[0]}</p>
            <p><strong>Город:</strong> {profile.city || 'Не указан'}</p>
            <p><strong>Пол:</strong> {profile.pol || 'Не указан'}</p>
          </div>
        ))
      ) : (
        <p>Анкеты не найдены.</p>
      )}
    </div>
  </div>
  );
}

export default Search;
