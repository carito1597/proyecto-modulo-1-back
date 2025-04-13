const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  // Validate email format
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Hash password
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // Verify password
  static async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT token
  static generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  }

  // Create a new user
  static async create(name, email, password) {
    try {
      // Validate email format
      if (!this.validateEmail(email)) {
        throw new Error('Invalid email format');
      }

      // Check if email already exists
      const emailExists = await this.findByEmail(email);
      if (emailExists) {
        throw new Error('Email already exists');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
        [name, email, hashedPassword]
      );

      const user = result.rows[0];
      // Generate token
      const token = this.generateToken(user.id);

      return { ...user, token };
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Login user
  static async login(email, password) {
    try {
      // Find user by email
      const user = await this.findByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      // Generate token
      const token = this.generateToken(user.id);

      // Return user data without password
      const { password: _, ...userData } = user;
      return { ...userData, token };
    } catch (error) {
      throw error;
    }
  }

  // Find user by id
  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT id, name, email FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all users
  static async findAll() {
    try {
      const result = await pool.query('SELECT id, name, email FROM users');
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Update user
  static async update(id, data) {
    try {
      const { name, email, password } = data;
      let hashedPassword = password;

      // If updating email, validate format and uniqueness
      if (email) {
        if (!this.validateEmail(email)) {
          throw new Error('Invalid email format');
        }

        const existingUser = await this.findByEmail(email);
        if (existingUser && existingUser.id !== parseInt(id)) {
          throw new Error('Email already exists');
        }
      }

      // If updating password, hash it
      if (password) {
        hashedPassword = await this.hashPassword(password);
      }

      const result = await pool.query(
        'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), password = COALESCE($3, password) WHERE id = $4 RETURNING id, name, email',
        [name, email, hashedPassword, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING id',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User; 