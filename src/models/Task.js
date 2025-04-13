const pool = require('../config/database');

class Task {
  constructor(title, description, status, dueDate, userId) {
    this.title = title;
    this.description = description;
    this.status = status;
    this.dueDate = dueDate;
    this.userId = userId;
  }

  // Validar el estado de la tarea
  static validateStatus(currentStatus, newStatus) {
    const validStatuses = ['pendiente', 'en progreso', 'completada'];
    
    // Verificar que el estado sea válido
    if (!validStatuses.includes(newStatus)) {
      throw new Error('Estado no válido');
    }

    // Reglas de transición de estado
    if (currentStatus === 'completada') {
      throw new Error('No se puede modificar una tarea completada');
    }

    if (currentStatus === 'pendiente' && newStatus === 'completada') {
      throw new Error('No se puede marcar como completada una tarea pendiente');
    }

    if (currentStatus === 'en progreso' && newStatus === 'pendiente') {
      throw new Error('No se puede volver a pendiente desde en progreso');
    }

    if (currentStatus === 'completada' && newStatus !== 'completada') {
      throw new Error('No se puede cambiar el estado de una tarea completada');
    }

    return true;
  }

  // Crear una nueva tarea
  static async create(title, description = null, dueDate = null, userId) {
    try {
      if (!title) {
        throw new Error('El título es obligatorio');
      }

      if (!userId) {
        throw new Error('El ID del usuario es requerido');
      }

      const result = await pool.query(
        `INSERT INTO tasks (title, description, status, due_date, user_id) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [title, description, 'pendiente', dueDate, userId]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener todas las tareas de un usuario
  static async getAllByUser(userId) {
    try {
      const result = await pool.query(
        'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener una tarea específica
  static async getById(taskId, userId) {
    try {
      const result = await pool.query(
        'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
        [taskId, userId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Actualizar una tarea
  static async update(taskId, userId, updates) {
    try {
      const currentTask = await this.getById(taskId, userId);
      
      if (!currentTask) {
        throw new Error('Tarea no encontrada');
      }

      // Validar que no se pueda modificar una tarea completada
      if (currentTask.status === 'completada') {
        throw new Error('No se puede modificar una tarea completada');
      }

      // Si se está actualizando el estado, validar las reglas de transición
      if (updates.status) {
        this.validateStatus(currentTask.status, updates.status);
      }

      const result = await pool.query(
        `UPDATE tasks 
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             status = COALESCE($3, status),
             due_date = COALESCE($4, due_date),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $5 AND user_id = $6
         RETURNING *`,
        [
          updates.title,
          updates.description,
          updates.status,
          updates.dueDate,
          taskId,
          userId
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Marcar tarea como completada
  static async markAsCompleted(taskId, userId) {
    try {
      const currentTask = await this.getById(taskId, userId);
      
      if (!currentTask) {
        throw new Error('Tarea no encontrada');
      }

      if (currentTask.status !== 'en progreso') {
        throw new Error('Solo se pueden completar tareas en progreso');
      }

      const result = await pool.query(
        `UPDATE tasks 
         SET status = 'completada',
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [taskId, userId]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Eliminar una tarea
  static async delete(taskId, userId) {
    try {
      const task = await this.getById(taskId, userId);
      
      if (!task) {
        throw new Error('Tarea no encontrada');
      }

      if (task.status !== 'completada') {
        throw new Error('Solo se pueden eliminar tareas completadas');
      }

      const result = await pool.query(
        'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
        [taskId, userId]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Task; 