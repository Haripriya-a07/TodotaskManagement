export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'open' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
}

export type TaskFilter = 'all' | 'active' | 'completed';