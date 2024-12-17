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

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM Password WHERE email_user = $1 AND password = $2', [email, password]);
    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Успешный вход', token: email }); // вернем email как token
    } else {
      res.status(401).send('Неверный email или пароль');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка при входе');
  }
});
// Маршрут для получения профиля текущего пользователя
app.get('/api/profile', async (req, res) => {
  const authToken = req.headers.authorization?.split(' ')[1];

  if (!authToken) {
    return res.status(401).send('Не авторизован');
  }

  try {
    const result = await pool.query(
      `SELECT 
        u.name, 
        u.data_birthday, 
        u.pol AS gender, 
        u.city, 
        u.comments, 
        
        NULL AS hobbies
      FROM Users u
      LEFT JOIN photo p ON u.email = p.email_user
      WHERE u.email = $1`,
      [authToken]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Пользователь не найден');
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    res.status(500).send('Ошибка сервера');
  }
});



app.get('/profiles', async (req, res) => {
  const authToken = req.headers.authorization?.split(' ')[1];

  if (!authToken) {
    return res.status(401).send('Не авторизован');
  }

  try {
    const result = await pool.query(
      `SELECT * FROM Users 
       LEFT JOIN photo ON Users.email = photo.email_user 
       LEFT JOIN (
         SELECT email AS email_user, get_user_hobby(email) AS hobby 
         FROM Users WHERE status = true
       ) AS hobbies ON Users.email = hobbies.email_user 
       WHERE status IS true AND Users.email <> $1`, // Исключаем текущего пользователя
      [authToken]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении анкет:', error);
    res.status(500).send('Ошибка при получении анкет');
  }
});

// Маршрут для обновления профиля пользователя
app.put('/api/profile', async (req, res) => {
  const authToken = req.headers.authorization?.split(' ')[1];

  if (!authToken) {
    return res.status(401).send('Не авторизован');
  }

  const { name, gender, data_birthday, city, comments } = req.body;

  try {
    // Обновление данных пользователя
    const result = await pool.query(
      `UPDATE Users 
       SET name = $1, pol = $2, data_birthday = $3, city = $4, comments = $5
       WHERE email = $6
       RETURNING name, pol AS gender, data_birthday, city, comments`,
      [name, gender, data_birthday, city, comments, authToken]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Пользователь не найден');
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для получения списка хобби
app.get('/api/hobbies', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, h_name FROM Hobby'); // Предполагается, что таблица Hobby содержит столбцы id и name
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении хобби:', error);
    res.status(500).send('Ошибка сервера');
  }
});

app.put('/api/profile/hobbies', async (req, res) => {
  const authToken = req.headers.authorization?.split(' ')[1];
  const { hobbies } = req.body; // hobbies — массив id хобби

  if (!authToken) {
    return res.status(401).send('Не авторизован');
  }

  try {
    // Удаляем текущие хобби пользователя
    await pool.query('DELETE FROM User_hobby WHERE email_user = $1', [authToken]);

    // Добавляем новые хобби
    if (hobbies && hobbies.length > 0) {
      const values = hobbies.map((hobbyName) => `('${authToken}', '${hobbyName}')`).join(', ');
      await pool.query(`INSERT INTO User_hobby (email_user, h_name) VALUES ${values}`);
    }

    res.status(200).send('Хобби успешно обновлены');
  } catch (error) {
    console.error('Ошибка при обновлении хобби:', error);
    res.status(500).send('Ошибка сервера');
  }
});

app.get('/api/profile/user_hobbies', async (req, res) => {
  const authToken = req.headers.authorization?.split(' ')[1];

  if (!authToken) {
    return res.status(401).send('Не авторизован');
  }

  try {
    const result = await pool.query(
      'SELECT h_name FROM User_hobby WHERE email_user = $1',
      [authToken]
    );
    const userHobbies = result.rows.map((row) => row.h_name);
    res.json(userHobbies);
  } catch (error) {
    console.error('Ошибка при получении хобби пользователя:', error);
    res.status(500).send('Ошибка сервера');
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
