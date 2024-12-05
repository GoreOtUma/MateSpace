import React, { useState } from 'react';
import '../styles/Search.css';

function Search() {
  const [isFilterOpen, setFilterOpen] = useState(false);

  function handleFilterToggle() {
    setFilterOpen(!isFilterOpen);
  }

  return (
    <div className="search">
      <button className="search-button">Поиск анкет</button>
      <button className="filter-button" onClick={handleFilterToggle}>Фильтр</button>

      {isFilterOpen && (
        <div className="filter-modal">
          <h2>Фильтры</h2>
          <form>
            <label>
              Интересы:
              <input type="text" name="interests" />
            </label>
            <label>
              Занятия:
              <input type="text" name="activities" />
            </label>
            <label>
              Местоположение:
              <input type="text" name="location" />
            </label>
            <label>
              Пол:
              <input type="text" name="gender" />
            </label>
            <label>
              Возраст:
              <input type="number" name="age" />
            </label>
            <button type="submit" className="search-submit">Поиск анкет</button>
          </form>
          <button onClick={handleFilterToggle} className="close-button">Закрыть</button>
        </div>
      )}
    </div>
  );
}

export default Search;
