import express from 'express';
import cors from 'cors';
import { getDb } from '../db/database.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/users/register', async (req, res) => {
  const { nombreComp, email, password, telefono, ciudad } = req.body;
  if (!nombreComp || !email || !password) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  try {
    const db = await getDb();
    const existing = await db.get('SELECT idUsuario FROM Usuario WHERE email = ?', email);
    if (existing) {
      return res.status(409).json({ message: 'Correo ya registrado' });
    }

    const result = await db.run(
      `INSERT INTO Usuario (nombreComp, email, password, telefono, ciudad)
       VALUES (?, ?, ?, ?, ?)` ,
      nombreComp,
      email,
      password,
      telefono ?? null,
      ciudad ?? null
    );

    res.status(201).json({
      idUsuario: result.lastID,
      nombreComp,
      email,
      telefono,
      ciudad,
    });
  } catch (error) {
    console.error('Error registrando usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Faltan credenciales' });
  }

  try {
    const db = await getDb();
    const user = await db.get(
      'SELECT idUsuario, nombreComp, email, password FROM Usuario WHERE email = ?',
      email
    );

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    res.json({
      idUsuario: user.idUsuario,
      nombreComp: user.nombreComp,
      email: user.email,
    });
  } catch (error) {
    console.error('Error iniciando sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API HappyPaws escuchando en http://localhost:${PORT}`);
});
