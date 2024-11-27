import React from 'react';
import '../styles/Auth.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Регистрация</h2>
        <form>
          <label>Имя</label>
          <input type="text" placeholder="Введите имя" />
          <label>Email</label>
          <input type="email" placeholder="Введите email" />
          <label>Дата рождения</label>
          <input type="date" />
          <label>Пароль</label>
          <input type="password" placeholder="Введите пароль" />
          <label>Повторите пароль</label>
          <input type="password" placeholder="Повторите пароль" />
          <button className="auth-button">Зарегистрироваться</button>
        </form>
        <div className="switch-text">
          Уже есть аккаунт? <a onClick={() => navigate('/login')}>Войти</a>
        </div>
      </div>
    </div>
  );
}

export default Register;
