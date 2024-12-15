import React, { useState, useEffect } from 'react';
import '../styles/Search.css';
import axios from 'axios';

function Search() {
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    interests: '',
    location: '',
    gender: '',
    age: '',
  });

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/profiles');
        setProfiles(response.data);
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
    console.log('Фильтры применены:', filters);
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
      ) : profiles.length > 0 ? (
        profiles.map((profile) => (
          <div key={profile.email} className="profile-card">
            <img
              src={`data:image/jpeg;base64,${profile.link_ph}` || ""}
              alt={''}
            />
            <h3>{profile.name}</h3>
            <p>{profile.comments || ''}</p>
            <p>{profile.hobby || ''}</p>
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
