

const { Pool } = require('pg');

// Создайте пул подключений
const pool = new Pool({
  user: 'postgres',      // ваш пользователь PostgreSQL
  host: 'localhost',          // хост (обычно localhost)
  database: 'localhost',  // имя базы данных
  password: 'root',  // ваш пароль
  port: 5432,                 // порт PostgreSQL
});

module.exports = pool;
