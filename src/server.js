const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sql = require('mssql');
const twilio = require('twilio'); // Agregar Twilio

// Crear una instancia de Express
const app = express();
const port = process.env.PORT || 3000; // Cambiado aquí

// Middleware
app.use(cors({
    origin: 'https://timedata-ruddy.vercel.app/', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de conexión a SQL Azure
const dbConfig = {
    user: 'TimeData',
    password: '1Key080603',
    server: 'timedata1.database.windows.net', 
    database: 'TimeData',
    options: {
        encrypt: true, // Utilizado para SQL Azure
        trustServerCertificate: false
    }
};

// Conexión a SQL Azure
async function connectDB() {
    try {
        await sql.connect(dbConfig);
        console.log('Conectado a la base de datos SQL Azure.');
    } catch (err) {
        console.error("Error al conectar a la base de datos:", err.message);
    }
}

// Crear tablas si no existen
async function createTables() {
    try {
        await sql.query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
            CREATE TABLE users (
                id INT PRIMARY KEY IDENTITY(1,1),
                username NVARCHAR(50) NOT NULL,
                password NVARCHAR(255) NOT NULL,
                accountType NVARCHAR(50) NOT NULL,
                phone NVARCHAR(20) NOT NULL UNIQUE
            );
        `);
        console.log('Tabla de usuarios creada o ya existe.');

        await sql.query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='retos' AND xtype='U')
            CREATE TABLE retos (
                id INT PRIMARY KEY IDENTITY(1,1),
                titulo NVARCHAR(255) NOT NULL,
                descripcion NVARCHAR(255) NOT NULL,
                lenguaje NVARCHAR(50) NOT NULL  
            );
        `);
        console.log('Tabla de retos creada o ya existe.');
    } catch (err) {
        console.error("Error al crear las tablas:", err.message);
    }
}

// Llamar a la función para conectar y crear tablas
connectDB().then(() => createTables());

// Ruta para registrar usuarios
app.post('/register', async (req, res) => {
    const { username, password, accountType, phone } = req.body;

    // Validar campos
    if (!username || !password || !accountType || !phone) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const result = await sql.query`SELECT * FROM users WHERE phone = ${phone}`;
        if (result.recordset.length > 0) {
            return res.status(400).json({ message: 'El número de teléfono ya está en uso.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await sql.query`INSERT INTO users (username, password, accountType, phone) VALUES (${username}, ${hashedPassword}, ${accountType}, ${phone})`;

        const newUser = await sql.query`SELECT * FROM users WHERE phone = ${phone}`;
        res.status(201).json({
            message: 'Usuario registrado e iniciado sesión exitosamente.',
            user: { username: newUser.recordset[0].username, accountType: newUser.recordset[0].accountType, phone: newUser.recordset[0].phone }
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
    const { phone, password } = req.body;

    try {
        const result = await sql.query`SELECT * FROM users WHERE phone = ${phone}`;
        const user = result.recordset[0];

        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            user: { username: user.username, accountType: user.accountType, phone: user.phone }
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Ruta para crear un reto y notificar a través de Twilio
app.post('/crear-reto', async (req, res) => {
    const { titulo, descripcion, lenguaje } = req.body; // Agregado lenguaje aquí

    // Validar que los campos de título, descripción y lenguaje estén presentes
    if (!titulo || !descripcion || !lenguaje) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        await sql.query`INSERT INTO retos (titulo, descripcion, lenguaje) VALUES (${titulo}, ${descripcion}, ${lenguaje})`; // Agregado lenguaje aquí

        // Configuración de Twilio
        const accountSid = 'AC2ae68485f155dcc09dcfcdb9a8bec8c3';
        const authToken = 'edf324a2b9ce2f5bd64f2ed30d0bbdb2';
        const client = twilio(accountSid, authToken);

        // Enviar el mensaje a un número fijo
        client.messages.create({
            body: `¡Es hora de programar! Se ha creado un nuevo reto en TimeData: ${titulo}, Lenguaje: ${lenguaje}`, // Incluye el lenguaje aquí
            from: '+17633163890',
            to: '+50671020174',
        })
        .then(message => {
            console.log(`Mensaje enviado: ${message.sid}`);
            res.status(201).json({ message: 'Reto creado y notificación enviada.' });
        })
        .catch(err => {
            console.error(`Error al enviar el mensaje: ${err.message}`);
            res.status(500).json({ error: 'Error al enviar la notificación.' });
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Ruta para obtener todos los retos
app.get('/retos', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM retos`;
        res.status(200).json(result.recordset);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.delete('/retos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await sql.query`DELETE FROM retos WHERE id = ${id}`;
        res.status(200).json({ message: 'Reto eliminado exitosamente.' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
