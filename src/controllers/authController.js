const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authController = {
  // Registro de usuario
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      // Validación básica
      if (!name || !email || !password) {
        return res.status(400).json({ 
          error: 'Todos los campos son requeridos (nombre, email, contraseña)' 
        });
      }

      const newUser = await User.create(name, email, password);
      
      // Eliminamos la contraseña del objeto de respuesta
      const { password: _, ...userWithoutPassword } = newUser;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error.message === 'Email already exists' || error.message === 'Invalid email format') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al registrar el usuario' });
    }
  },

  // Inicio de sesión
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email y contraseña son requeridos' 
        });
      }

      const userData = await User.login(email, password);
      res.json(userData);
    } catch (error) {
      if (error.message === 'User not found' || error.message === 'Invalid password') {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      res.status(500).json({ error: 'Error en el inicio de sesión' });
    }
  },

  // Obtener datos del usuario autenticado
  me: async (req, res) => {
    try {
      // Obtener el token del header de autorización
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      const token = authHeader.split(' ')[1];

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Buscar el usuario
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Eliminar la contraseña antes de enviar la respuesta
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token inválido' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
      }
      res.status(500).json({ error: 'Error al obtener los datos del usuario' });
    }
  }
};

module.exports = authController; 