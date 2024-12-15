const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'matespace',
  password: 'postgres',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

// Маршрут для регистрации пользователя
app.post('/register', async (req, res) => {
  const { name, email, birthday, password } = req.body;
  try {
    await pool.query('INSERT INTO Users (email, name, data_birthday) VALUES ($1, $2, $3)', [email, name, birthday]);
    await pool.query('INSERT INTO Password (email_user, password) VALUES ($1, $2)', [email, password]);
    res.status(201).send('Пользователь успешно зарегистрирован');
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка при регистрации');
  }
});

// Маршрут для входа пользователя
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM Password WHERE email_user = $1 AND password = $2', [email, password]);
    if (result.rows.length > 0) {
      res.status(200).send('Успешный вход');
    } else {
      res.status(401).send('Неверный email или пароль');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка при входе');
  }
});

// Маршрут для добавления мероприятия
app.post('/api/events', async (req, res) => {
  const { time, location, theme, count_people, latitude, longitude } = req.body;

  if (!time || !location || !theme || !latitude || !longitude) {
    return res.status(400).send('Все поля обязательны для заполнения');
  }

  try {
    // Проверяем наличие темы и добавляем, если ее нет
    const themeCheckResult = await pool.query('SELECT * FROM theme_event WHERE theme = $1', [theme]);
    let themeId;

    if (themeCheckResult.rows.length === 0) {
      const addThemeResult = await pool.query('INSERT INTO theme_event (theme) VALUES ($1) RETURNING id', [theme]);
      themeId = addThemeResult.rows[0].id;
    } else {
      themeId = themeCheckResult.rows[0].id;
    }

    // Вставляем событие в таблицу event
    const result = await pool.query(
      'INSERT INTO event (time, location, theme, count_people, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [time, location, themeId, count_people || 0, latitude, longitude]
    );

    const eventId = result.rows[0].id;
    res.status(201).json({ message: 'Мероприятие успешно добавлено', eventId });
  } catch (error) {
    console.error('Ошибка при добавлении события:', error);
    res.status(500).send('Ошибка при добавлении события');
  }
});

// Маршрут для получения всех мероприятий
app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        e.id, e.time, e.location, e.theme, e.count_people, 
        e.latitude, e.longitude, 
        t.theme AS theme_name
      FROM event e
      JOIN theme_event t ON e.theme = t.id`
    );

    res.status(200).json(result.rows); // Отправляем данные в формате JSON
  } catch (error) {
    console.error('Ошибка при получении мероприятий:', error);
    res.status(500).send('Ошибка при получении мероприятий');
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
