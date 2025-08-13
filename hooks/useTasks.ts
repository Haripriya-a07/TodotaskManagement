import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/types/task';
import { StorageService } from '@/services/storage';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      const loadedTasks = await StorageService.getTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshTasks = useCallback(async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  }, [loadTasks]);

  const addTask = useCallback(async (task: Task) => {
    try {
      await StorageService.addTask(task);
      setTasks(prev => [...prev, task]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }, []);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      await StorageService.updateTask(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await StorageService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, []);

  const toggleTaskStatus = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newStatus = task.status === 'completed' ? 'open' : 'completed';
      await updateTask(taskId, { status: newStatus });
    }
  }, [tasks, updateTask]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    loading,
    refreshing,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    refreshTasks,
  };
}