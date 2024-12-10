
const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',      // ваш пользователь PostgreSQL
  host: 'localhost',          // хост (обычно localhost)
  database: 'localhost',  // имя базы данных
  password: 'postgres',  // ваш пароль
  port: 5432,                 // порт PostgreSQL
});
async function testConnection() {
    try {
      // Пробуем выполнить простой запрос
      const res = await pool.query('SELECT NOW()');
      console.log('Подключение успешно:', res.rows[0]);
    } catch (err) {
      console.error('Ошибка подключения:', err);
    } finally {
      pool.end(); // Закрываем подключение
    }
  }
testConnection();