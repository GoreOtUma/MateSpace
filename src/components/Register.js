// src/components/Register.js
import React from 'react';
import '../styles/Auth.css';

function Register() {
  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Регистрация</h2>
        <label>Имя</label>
        <input type="text" placeholder="Введите ваше имя" />
        <label>Email</label>
        <input type="email" placeholder="Введите ваш email" />
        <label>Дата рождения</label>
        <input type="date" />
        <label>Пароль</label>
        <input type="password" placeholder="Введите пароль" />
        <label>Повторите пароль</label>
        <input type="password" placeholder="Повторите пароль" />
        <button className="auth-button">Зарегистрироваться</button>
        <p className="switch-text">
          <a href="/login">Войти</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
