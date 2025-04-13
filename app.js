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
  origin: ['https://proyecto-modulo-1-pi.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
  credentials: false, // Cambiado a false si no estás usando cookies
  optionsSuccessStatus: 200
};

// Debug middleware para CORS y errores
app.use((req, res, next) => {
  console.log('Request:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    body: req.body
  });
  next();
});

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

// Middleware de manejo de errores mejorado
app.use((err, req, res, next) => {
  console.error('Error detallado:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Token inválido o no proporcionado' });
  }
  
  // Error genérico con más detalles
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message,
    path: req.path
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