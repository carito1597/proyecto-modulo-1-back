const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register - Registro de usuario
router.post('/register', authController.register);

// POST /api/auth/login - Inicio de sesión
router.post('/login', authController.login);

// GET /api/auth/me - Obtener datos del usuario autenticado
router.get('/me', authController.me);

module.exports = router;