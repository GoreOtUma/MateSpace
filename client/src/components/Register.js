import React, { useState } from 'react';
import '../styles/Auth.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', birthday: '', password: '', confirmPassword: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    try {
      await axios.post('http://localhost:5000/register', {
        name: formData.name,
        email: formData.email,
        birthday: formData.birthday,
        password: formData.password,
      });
      alert('Регистрация успешна');
      navigate('/login');
    } catch (error) {
      alert('Ошибка при регистрации');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <label>Имя</label>
          <input type="text" name="name" placeholder="Введите имя" onChange={handleChange} />
          <label>Email</label>
          <input type="email" name="email" placeholder="Введите email" onChange={handleChange} />
          <label>Дата рождения</label>
          <input type="date" name="birthday" onChange={handleChange} />
          <label>Пароль</label>
          <input type="password" name="password" placeholder="Введите пароль" onChange={handleChange} />
          <label>Повторите пароль</label>
          <input type="password" name="confirmPassword" placeholder="Повторите пароль" onChange={handleChange} />
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
