import React, { useState } from 'react';
import '../styles/Auth.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/login', formData);
      alert('Вход успешен');
      navigate('/');
    } catch (error) {
      alert('Неверный email или пароль');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Вход</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" name="email" required onChange={handleChange} />
          <label>Пароль</label>
          <input type="password" name="password" required onChange={handleChange} />
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
