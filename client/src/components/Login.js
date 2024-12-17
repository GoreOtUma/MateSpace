import React, { useState } from 'react';
import '../styles/Auth.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Получаем метод login из AuthContext
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', formData);
  
      if (response.data.status === false) {
        alert('Ваш профиль был удалён');
        return;
      }
  
      alert('Вы вошли в систему');
      login(response.data.token); // Сохраняем токен
      navigate('/'); // Перенаправляем на главную страницу
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
