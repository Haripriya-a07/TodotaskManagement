import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, User } from '@/types/task';

const TASKS_KEY = '@tasks';
const USER_KEY = '@user';

export class StorageService {
  static async getTasks(): Promise<Task[]> {
    try {
      const tasks = await AsyncStorage.getItem(TASKS_KEY);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  }

  static async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  static async addTask(task: Task): Promise<void> {
    try {
      const tasks = await this.getTasks();
      tasks.push(task);
      await this.saveTasks(tasks);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }

  static async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    try {
      const tasks = await this.getTasks();
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updates, updatedAt: new Date().toISOString() };
        await this.saveTasks(tasks);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  static async deleteTask(taskId: string): Promise<void> {
    try {
      const tasks = await this.getTasks();
      const filteredTasks = tasks.filter(task => task.id !== taskId);
      await this.saveTasks(filteredTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  static async getUser(): Promise<User | null> {
    try {
      const user = await AsyncStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  static async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  static async clearUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error clearing user:', error);
    }
  }
}