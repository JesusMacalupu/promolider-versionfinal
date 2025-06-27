require('dotenv').config();

const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');

const app = express();

// Configuración de SQL Server
const config = {
  user: 'sa',
  password: '12345',
  server: 'LAPTOP-LBB057TI',
  port: 1433,
  database: 'PromoliderWeb',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// Conexión a SQL Server
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

// Configuración Meta CAPI
const META_PIXEL_ID = process.env.META_PIXEL_ID;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_API_URL = `https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events`;

// Función para hashear datos
function hashSHA256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

// Función para enviar evento a Meta
async function enviarEventoMeta({ correo, celular, tipo }) {
  const evento = {
    event_name: tipo === 'productor' ? 'LeadProductor' : 'LeadDistribuidor',
    event_time: Math.floor(Date.now() / 1000),
    user_data: {
      em: [hashSHA256(correo.toLowerCase())],
      ph: [hashSHA256(celular)],
    },
    action_source: 'website',
  };

  try {
    const response = await axios.post(`${META_API_URL}?access_token=${META_ACCESS_TOKEN}`, {
      data: [evento]
    });
    console.log('📤 Evento enviado a Meta CAPI:', response.data);
  } catch (err) {
    console.error('❌ Error al enviar evento a Meta:', err.response?.data || err.message);
  }
}

// Endpoint para guardar productores
app.post('/api/guardar-productor', async (req, res) => {
  const { nombre, correo, celular } = req.body;

  if (!nombre || !correo || !celular) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const emailRegex = /^[a-zA-Z0-9ñÑ._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(correo)) {
    return res.status(400).json({ 
      error: 'Formato de correo no válido. Se permite "ñ" solo antes del @',
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

    await enviarEventoMeta({ correo, celular, tipo: 'productor' });

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

  const emailRegex = /^[a-zA-Z0-9ñÑ._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(correo)) {
    return res.status(400).json({ 
      error: 'Formato de correo no válido. Se permite "ñ" solo antes del @',
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

    await enviarEventoMeta({ correo, celular, tipo: 'distribuidor' });

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
