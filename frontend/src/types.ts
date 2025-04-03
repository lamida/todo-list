export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  userId: string;
}

export interface CreateTodoDto {
  text: string;
}

export interface UpdateTodoDto {
  text?: string;
  completed?: boolean;
}

export interface User {
  id: string;
  userId: string;
  email: string;
  name: string;
  picture?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  error: string | null;
  login: (token: string) => void;
  logout: () => void;
} 