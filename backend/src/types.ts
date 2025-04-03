import { Request } from 'express';

export interface User {
  id: string;
  userId: string;
  googleId: string;
  email: string;
  name: string;
  picture?: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  userId: string;
}

export interface CreateTodoDto {
  text: string;
}

export interface UpdateTodoDto {
  text?: string;
  completed?: boolean;
}

export interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export interface JwtPayload {
  userId: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
} 