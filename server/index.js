const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'localhost',
  password: 'postgres',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
