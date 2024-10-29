// src/components/Login.js
import React from 'react';
import '../styles/Auth.css';

function Login() {
  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Вход</h2>
        <label>Email</label>
        <input type="email" placeholder="Введите ваш email" />
        <label>Пароль</label>
        <input type="password" placeholder="Введите ваш пароль" />
        <button className="auth-button">Войти</button>
        <p className="switch-text">
          <a href="/register">Зарегистрироваться</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
