const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

// Import routes
const routes = require('./src/routes');

const app = express();

// CORS configuration
const corsOptions = {
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000', 'https://proyecto-modulo-1-pi.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Token inválido o no proporcionado' });
  }
  
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 