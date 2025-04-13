# Node.js Express PostgreSQL Project

This is a backend project using Node.js, Express, and PostgreSQL with MVC architecture.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a PostgreSQL database
4. Configure the `.env` file with your database credentials
5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── config/         # Configuration files
│   └── database.js # Database configuration
├── controllers/    # Route controllers
├── middlewares/    # Custom middlewares
├── models/         # Database models
├── routes/         # Route definitions
└── utils/          # Utility functions
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon 