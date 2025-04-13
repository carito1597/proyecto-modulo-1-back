const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const userRoutes = require('./userRoutes');

// Home route
router.get('/', homeController.index);

// User routes
router.use('/users', userRoutes);

module.exports = router; 