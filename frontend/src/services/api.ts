import axios from 'axios';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../types';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getTodos = async (): Promise<Todo[]> => {
  const response = await api.get('/todos');
  return response.data;
};

export const createTodo = async (todo: CreateTodoDto): Promise<Todo> => {
  const response = await api.post('/todos', todo);
  return response.data;
};

export const updateTodo = async (id: string, todo: UpdateTodoDto): Promise<Todo> => {
  const response = await api.put(`/todos/${id}`, todo);
  return response.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await api.delete(`/todos/${id}`);
};

export const loginWithGoogle = () => {
  window.location.href = 'http://localhost:3001/auth/google';
}; 