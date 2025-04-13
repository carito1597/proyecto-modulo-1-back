const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function createTasksTable() {
  try {
    const client = await pool.connect();
    try {
      // Leer el archivo SQL
      const sqlPath = path.join(__dirname, 'migrations', '002_create_tasks_table.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');

      // Ejecutar la creación de la tabla
      await client.query(sql);
      console.log('Tabla de tareas creada exitosamente');
    } catch (err) {
      console.error('Error al crear la tabla:', err);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error al conectar:', err);
  } finally {
    await pool.end();
  }
}

createTasksTable(); 