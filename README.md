# Todo List Application

A full-stack Todo List application built with React, TypeScript, and Express.js.

## Project Structure

```
/
├── frontend/          # React frontend application
└── backend/          # Express.js backend server
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The backend server will run on http://localhost:3001

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The frontend application will run on http://localhost:3000

## Running the Application

1. Open two terminal windows

2. In the first terminal, start the backend:
   ```bash
   cd backend
   npm run dev
   ```

3. In the second terminal, start the frontend:
   ```bash
   cd frontend
   npm start
   ```

4. Open your browser and navigate to http://localhost:3000

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Development

- Backend uses Express.js with TypeScript
- Frontend uses Create React App with TypeScript
- The application uses an in-memory database for simplicity
- CORS is configured to allow communication between frontend and backend

## Troubleshooting

If you encounter any issues:

1. Make sure both servers are running
2. Check the console for error messages
3. Verify that you're in the correct directory when running commands
4. Ensure all dependencies are installed correctly

## Features

- Add new todos
- Mark todos as complete/incomplete
- Delete todos
- Real-time updates
- Type-safe development with TypeScript 