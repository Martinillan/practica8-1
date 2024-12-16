const express = require('express');
const { Client } = require('pg');
require('dotenv').config(); // Carga variables de entorno desde .env

const app = express();
const { sql } = require('@vercel/postgres');

const path = require("path");

// Configurar Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, "public")));

// Ruta principal para cargar el archivo index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});






// Ruta dinámica para obtener un empleado por nombre
app.get('/empleado/:nombre', async (req, res) => {
  const { nombre } = req.params; // Extraemos el nombre del parámetro de la URL

  try {
    // Realizamos la consulta a la base de datos
    const result = await sql('SELECT * FROM empleados WHERE nombre = $1', [nombre]);

    // Si se encuentra el empleado, enviamos los datos en formato JSON
    if (result.rows.length > 0) {
      res.json(result.rows[0]);  // Devuelve el primer resultado
    } else {
      res.status(404).send('Empleado no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener el empleado:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para obtener los datos de la tabla empleados
app.get('/empleados', async (req, res) => {
  try {
    const result = await sql('SELECT * FROM empleados;'); // Consulta a la tabla empleados
    res.json(result.rows); // Devuelve los datos en formato JSON
  } catch (err) {
    console.error('Error al consultar la tabla empleados:', err);
    res.status(500).send('Error al obtener los empleados.');
  }
});

// Iniciar el servidor
const port = process.env.PORT || 5000; // Esto permitirá que Vercel use su puerto.
module.exports = app;

