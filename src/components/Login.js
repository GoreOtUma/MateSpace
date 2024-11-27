import React from 'react';
import '../styles/Auth.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Вход</h2>
        <form>
          <label>Email</label>
          <input type="email" required />
          <label>Пароль</label>
          <input type="password" required />
          <button type="submit" className="auth-button">Войти</button>
        </form>
        <div className="switch-text">
          <span>Нет аккаунта? </span>
          <a onClick={() => navigate('/register')}>Зарегистрироваться</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
