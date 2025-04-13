const Task = require('../models/Task');

const taskController = {
  // Crear una nueva tarea
  createTask: async (req, res) => {
    try {
      const { title, description, dueDate } = req.body;
      const userId = req.user.id; // Este valor vendrá del middleware de autenticación

      if (!title) {
        return res.status(400).json({ error: 'El título es obligatorio' });
      }

      const task = await Task.create(title, description, dueDate, userId);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener todas las tareas del usuario con filtros
  getAllTasks: async (req, res) => {
    try {
      const userId = req.user.id;
      const { status, search } = req.query;

      let tasks;

      if (status) {
        // Filtrar por estado
        tasks = await Task.filterByStatus(userId, status);
      } else if (search) {
        // Buscar por palabra clave
        tasks = await Task.searchByKeyword(userId, search);
      } else {
        // Obtener todas las tareas
        tasks = await Task.getAllByUser(userId);
      }

      res.json(tasks);
    } catch (error) {
      if (error.message === 'Estado no válido') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener una tarea específica
  getTaskById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const task = await Task.getById(id, userId);
      if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }

      res.json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar una tarea
  updateTask: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updates = req.body;

      // Validar que al menos hay un campo para actualizar
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No hay campos para actualizar' });
      }

      const task = await Task.update(id, userId, updates);
      res.json(task);
    } catch (error) {
      if (error.message.includes('No se puede')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // Marcar tarea como completada
  markAsCompleted: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const task = await Task.markAsCompleted(id, userId);
      res.json(task);
    } catch (error) {
      if (error.message.includes('Solo se pueden')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar una tarea
  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await Task.delete(id, userId);
      res.status(204).send();
    } catch (error) {
      if (error.message.includes('Solo se pueden')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = taskController; 