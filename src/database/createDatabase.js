const { Pool } = require('pg');
require('dotenv').config();

const config = require('./config');

async function createDatabase() {
  // Conectar a postgres por defecto para crear la base de datos
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres' // Conectamos a la base de datos por defecto
  });

  try {
    const client = await pool.connect();
    
    try {
      // Intentar crear la base de datos
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`Database ${process.env.DB_NAME} created successfully!`);
    } catch (err) {
      if (err.code === '42P04') {
        console.log(`Database ${process.env.DB_NAME} already exists.`);
      } else {
        throw err;
      }
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await pool.end();
  }
}

// Ejecutar la creación de la base de datos
createDatabase(); 