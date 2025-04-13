const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

// POST /api/tasks - Crear una nueva tarea
router.post('/', taskController.createTask);

// GET /api/tasks - Obtener todas las tareas del usuario
router.get('/', taskController.getAllTasks);

// GET /api/tasks/:id - Obtener una tarea específica
router.get('/:id', taskController.getTaskById);

// PUT /api/tasks/:id - Actualizar una tarea
router.put('/:id', taskController.updateTask);

// PUT /api/tasks/:id/complete - Marcar tarea como completada
router.put('/:id/complete', taskController.markAsCompleted);

// DELETE /api/tasks/:id - Eliminar una tarea
router.delete('/:id', taskController.deleteTask);

module.exports = router; 