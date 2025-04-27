const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const config = {
  user: 'sa',
  password: '12345678',
  server: '10.0.0.1',
  port: 55555,
  database: 'PromoliderWeb',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

async function connectDB() {
  try {
    await sql.connect(config);
    console.log('✅ Conectado a SQL Server - PromoliderWeb');
  } catch (err) {
    console.error('❌ Error al conectar a SQL Server:', err);
  }
}

connectDB();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint para guardar productores
app.post('/api/guardar-productor', async (req, res) => {
  const { nombre, correo, celular } = req.body;

  if (!nombre || !correo || !celular) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  // Validación de correo (permite ñ solo antes del @)
  const emailRegex = /^[a-zA-Z0-9ñÑ._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(correo)) {
    return res.status(400).json({ 
      error: 'Formato de correo no válido. Se permite "ñ" solo antes del @ (ejemplo: usuarioñ@gmail.com)',
      success: false
    });
  }

  try {
    const request = new sql.Request();
    await request.input('nombre', sql.NVarChar, nombre)
                 .input('correo', sql.NVarChar, correo)
                 .input('celular', sql.NVarChar, celular)
                 .query(`
      INSERT INTO InfoProductor (nombre, correo, celular)
      VALUES (@nombre, @correo, @celular)
    `);

    res.status(200).json({ 
      mensaje: 'Solicitud de productor enviada con éxito',
      success: true
    });
  } catch (error) {
    console.error('Error al insertar en SQL Server:', error);
    res.status(500).json({ 
      error: 'Error al guardar en la base de datos',
      success: false
    });
  }
});

// Endpoint para guardar distribuidores
app.post('/api/guardar-distribuidor', async (req, res) => {
  const { nombre, correo, celular } = req.body;

  if (!nombre || !correo || !celular) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  // Validación de correo (permite ñ solo antes del @)
  const emailRegex = /^[a-zA-Z0-9ñÑ._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(correo)) {
    return res.status(400).json({ 
      error: 'Formato de correo no válido. Se permite "ñ" solo antes del @ (ejemplo: usuarioñ@gmail.com)',
      success: false
    });
  }

  try {
    const request = new sql.Request();
    await request.input('nombre', sql.NVarChar, nombre)
                 .input('correo', sql.NVarChar, correo)
                 .input('celular', sql.NVarChar, celular)
                 .query(`
      INSERT INTO InfoDistribuidor (nombre, correo, celular)
      VALUES (@nombre, @correo, @celular)
    `);

    res.status(200).json({ 
      mensaje: 'Solicitud de distribuidor enviada con éxito',
      success: true
    });
  } catch (error) {
    console.error('Error al insertar en SQL Server:', error);
    res.status(500).json({ 
      error: 'Error al guardar en la base de datos',
      success: false
    });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});