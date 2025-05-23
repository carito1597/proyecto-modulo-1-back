# API de Autenticación y Usuarios

Este proyecto es una API RESTful para la gestión de usuarios, tareas y autenticación, construida con Node.js, Express y PostgreSQL.

## Requisitos Previos

- Node.js (v14 o superior)
- PostgreSQL
- npm o yarn

## URLs de Despliegue

- **Backend**: https://proyecto-modulo-1-back.onrender.com
- **Frontend**: https://proyecto-modulo-1-pi.vercel.app

### Endpoints Desplegados

- **Registro**: https://proyecto-modulo-1-back.onrender.com/api/auth/register
- **Login**: https://proyecto-modulo-1-back.onrender.com/api/auth/login
- **Perfil de Usuario**: https://proyecto-modulo-1-back.onrender.com/api/auth/me
- **Usuarios**: https://proyecto-modulo-1-back.onrender.com/api/users
- **Tareas**: https://proyecto-modulo-1-back.onrender.com/api/tasks

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno en `.env`:
   ```
   PORT=3000
   DB_HOST=dpg-cvu08mbuibrs73egp78g-a.oregon-postgres.render.com
   DB_PORT=5432
   DB_USER=proyecto_modulo_1_db_user
   DB_PASSWORD=Q6c8Pl3zBfTTu9Zep02VguKcoRJ2lEk2
   DB_NAME=proyecto_modulo_1_db
   FRONTEND_URL=https://proyecto-modulo-1-pi.vercel.app
   JWT_SECRET=una_clave_secreta_larga_y_segura
   ```
4. Ejecutar migraciones:
   ```bash
   npm run migrate
   ```
5. Iniciar el servidor:
   ```bash
   npm run dev
   ```

## Endpoints de la API

### Autenticación

#### 1. Registro de Usuario
- **URL**: `/api/auth/register`
- **Método**: `POST`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "name": "Usuario Ejemplo",
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
  }
  ```
- **Respuesta Exitosa** (201 Created):
  ```json
  {
    "id": 1,
    "name": "Usuario Ejemplo",
    "email": "usuario@ejemplo.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Respuesta de Error** (400 Bad Request):
  ```json
  {
    "error": "Email already exists"
  }
  ```

#### 2. Inicio de Sesión
- **URL**: `/api/auth/login`
- **Método**: `POST`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
  }
  ```
- **Respuesta Exitosa** (200 OK):
  ```json
  {
    "id": 1,
    "name": "Usuario Ejemplo",
    "email": "usuario@ejemplo.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Respuesta de Error** (401 Unauthorized):
  ```json
  {
    "error": "Credenciales inválidas"
  }
  ```

#### 3. Obtener Datos del Usuario Autenticado
- **URL**: `/api/auth/me`
- **Método**: `GET`
- **Headers**: 
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Respuesta Exitosa** (200 OK):
  ```json
  {
    "id": 1,
    "name": "Usuario Ejemplo",
    "email": "usuario@ejemplo.com"
  }
  ```
- **Respuesta de Error** (401 Unauthorized):
  ```json
  {
    "error": "Token no proporcionado"
  }
  ```

### Usuarios

#### 1. Obtener Todos los Usuarios
- **URL**: `/api/users`
- **Método**: `GET`
- **Headers**: 
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Respuesta Exitosa** (200 OK):
  ```json
  [
    {
      "id": 1,
      "name": "Usuario Ejemplo",
      "email": "usuario@ejemplo.com"
    },
    {
      "id": 2,
      "name": "Otro Usuario",
      "email": "otro@ejemplo.com"
    }
  ]
  ```

#### 2. Obtener Usuario por ID
- **URL**: `/api/users/:id`
- **Método**: `GET`
- **Headers**: 
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Respuesta Exitosa** (200 OK):
  ```json
  {
    "id": 1,
    "name": "Usuario Ejemplo",
    "email": "usuario@ejemplo.com"
  }
  ```
- **Respuesta de Error** (404 Not Found):
  ```json
  {
    "error": "Usuario no encontrado"
  }
  ```

#### 3. Actualizar Usuario
- **URL**: `/api/users/:id`
- **Método**: `PUT`
- **Headers**: 
  ```
  Content-Type: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Body**:
  ```json
  {
    "name": "Usuario Actualizado",
    "email": "actualizado@ejemplo.com"
  }
  ```
- **Respuesta Exitosa** (200 OK):
  ```json
  {
    "id": 1,
    "name": "Usuario Actualizado",
    "email": "actualizado@ejemplo.com"
  }
  ```

#### 4. Eliminar Usuario
- **URL**: `/api/users/:id`
- **Método**: `DELETE`
- **Headers**: 
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Respuesta Exitosa** (204 No Content)
- **Respuesta de Error** (404 Not Found):
  ```json
  {
    "error": "Usuario no encontrado"
  }
  ```

### Tareas

#### 1. Obtener Todas las Tareas
- **URL**: `/api/tasks`
- **Método**: `GET`
- **Headers**: 
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Respuesta Exitosa** (200 OK):
  ```json
  [
    {
      "id": 1,
      "title": "Tarea de ejemplo",
      "description": "Descripción de la tarea",
      "status": "pending",
      "created_at": "2024-04-13T12:00:00.000Z",
      "updated_at": "2024-04-13T12:00:00.000Z"
    }
  ]
  ```

#### 2. Obtener Tarea por ID
- **URL**: `/api/tasks/:id`
- **Método**: `GET`
- **Headers**: 
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Respuesta Exitosa** (200 OK):
  ```json
  {
    "id": 1,
    "title": "Tarea de ejemplo",
    "description": "Descripción de la tarea",
    "status": "pending",
    "created_at": "2024-04-13T12:00:00.000Z",
    "updated_at": "2024-04-13T12:00:00.000Z"
  }
  ```
- **Respuesta de Error** (404 Not Found):
  ```json
  {
    "error": "Tarea no encontrada"
  }
  ```

#### 3. Crear Nueva Tarea
- **URL**: `/api/tasks`
- **Método**: `POST`
- **Headers**: 
  ```
  Content-Type: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Body**:
  ```json
  {
    "title": "Nueva tarea",
    "description": "Descripción de la nueva tarea",
    "status": "pending"
  }
  ```
- **Respuesta Exitosa** (201 Created):
  ```json
  {
    "id": 1,
    "title": "Nueva tarea",
    "description": "Descripción de la nueva tarea",
    "status": "pending",
    "created_at": "2024-04-13T12:00:00.000Z",
    "updated_at": "2024-04-13T12:00:00.000Z"
  }
  ```
- **Respuesta de Error** (400 Bad Request):
  ```json
  {
    "error": "El título es requerido"
  }
  ```

#### 4. Actualizar Tarea
- **URL**: `/api/tasks/:id`
- **Método**: `PUT`
- **Headers**: 
  ```
  Content-Type: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Body**:
  ```json
  {
    "title": "Tarea actualizada",
    "description": "Descripción actualizada",
    "status": "completed"
  }
  ```
- **Respuesta Exitosa** (200 OK):
  ```json
  {
    "id": 1,
    "title": "Tarea actualizada",
    "description": "Descripción actualizada",
    "status": "completed",
    "created_at": "2024-04-13T12:00:00.000Z",
    "updated_at": "2024-04-13T13:00:00.000Z"
  }
  ```
- **Respuesta de Error** (404 Not Found):
  ```json
  {
    "error": "Tarea no encontrada"
  }
  ```

#### 5. Eliminar Tarea
- **URL**: `/api/tasks/:id`
- **Método**: `DELETE`
- **Headers**: 
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Respuesta Exitosa** (204 No Content)
- **Respuesta de Error** (404 Not Found):
  ```json
  {
    "error": "Tarea no encontrada"
  }
  ```

## Códigos de Estado HTTP

- `200 OK`: La solicitud se ha completado con éxito
- `201 Created`: Recurso creado exitosamente
- `204 No Content`: La solicitud se ha completado pero no hay contenido para devolver
- `400 Bad Request`: La solicitud es inválida
- `401 Unauthorized`: No autorizado (token inválido o no proporcionado)
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

## Ejemplos de Uso con cURL

### Registro
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Usuario Prueba","email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Obtener Perfil
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Crear Tarea
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"title":"Nueva tarea","description":"Descripción de la tarea","status":"pending"}'
```

### Actualizar Tarea
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"title":"Tarea actualizada","status":"completed"}'
```

### Eliminar Tarea
```bash
curl -X DELETE http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
``` 