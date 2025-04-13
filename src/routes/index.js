const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');

// Home route
router.get('/', homeController.index);

// Auth routes (/api/auth/...)
router.use('/auth', authRoutes);

// User routes (/api/users/...)
router.use('/users', userRoutes);

module.exports = router; 