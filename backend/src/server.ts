import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Todo, CreateTodoDto, User, GoogleUserInfo, JwtPayload } from './types';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const port = 3001;

// In-memory database
let todos: Todo[] = [];
let users: User[] = [];

// Passport configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  const googleUser = profile._json as GoogleUserInfo;
  
  let user = users.find(u => u.googleId === googleUser.sub);
  if (!user) {
    const newUserId = uuidv4();
    user = {
      id: newUserId,
      userId: newUserId, // Use the same ID for both fields
      googleId: googleUser.sub,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture
    };
    users.push(user);
  }
  
  return done(null, user);
}));

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as User).id);
});

passport.deserializeUser((id: string, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: process.env.JWT_SECRET!,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Extend Express types
declare global {
  namespace Express {
    interface User {
      id: string;
      userId: string;
      googleId: string;
      email: string;
      name: string;
      picture?: string;
    }
  }
}

// Authentication middleware
const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      (req as any).user = decoded;
      next();
    } catch (err) {
      res.status(403).json({ message: 'Invalid token' });
    }
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
};

// Auth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: Request, res: Response): void => {
    console.log('OAuth callback received');
    console.log('User:', req.user);
    
    const user = req.user as User;
    if (!user) {
      console.error('No user found in request');
      res.redirect('http://localhost:3000/login?error=no_user');
      return;
    }

    try {
      const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET!);
      console.log('Generated JWT token');
      res.redirect(`http://localhost:3000/login?token=${token}`);
    } catch (error) {
      console.error('Error generating token:', error);
      res.redirect('http://localhost:3000/login?error=token_error');
    }
  }
);

// Get user information
app.get('/auth/me', authenticateJWT, (req: Request, res: Response): void => {
  const { userId } = (req as any).user as JwtPayload;
  const user = users.find(u => u.userId === userId);
  
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.json(user);
});

// GET all todos for the authenticated user
app.get('/api/todos', authenticateJWT, (req: Request, res: Response): void => {
  const user = (req as any).user as JwtPayload;
  const userTodos = todos.filter(todo => todo.userId === user.userId);
  res.json(userTodos);
});

// POST new todo
app.post('/api/todos', authenticateJWT, (req: Request, res: Response): void => {
  const user = (req as any).user as JwtPayload;
  const todoData: CreateTodoDto = req.body;
  const newTodo: Todo = {
    id: uuidv4(),
    text: todoData.text,
    completed: false,
    createdAt: new Date(),
    userId: user.userId
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT update todo
app.put('/api/todos/:id', authenticateJWT, (req: Request, res: Response): void => {
  const user = (req as any).user as JwtPayload;
  const { id } = req.params;
  const todoIndex = todos.findIndex(todo => todo.id === id && todo.userId === user.userId);
  
  if (todoIndex === -1) {
    res.status(404).json({ message: 'Todo not found' });
    return;
  }

  todos[todoIndex] = {
    ...todos[todoIndex],
    ...req.body,
    id // preserve the original id
  };

  res.json(todos[todoIndex]);
});

// DELETE todo
app.delete('/api/todos/:id', authenticateJWT, (req: Request, res: Response): void => {
  const user = (req as any).user as JwtPayload;
  const { id } = req.params;
  const todoIndex = todos.findIndex(todo => todo.id === id && todo.userId === user.userId);
  
  if (todoIndex === -1) {
    res.status(404).json({ message: 'Todo not found' });
    return;
  }

  todos = todos.filter(todo => todo.id !== id);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 