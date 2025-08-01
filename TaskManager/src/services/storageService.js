import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncTasks } from './supabaseService';
import { cancelTaskNotification } from './notificationService';

const TASKS_KEY = 'TASKS';

export const getTasks = async () => {
  try {
    const tasks = await AsyncStorage.getItem(TASKS_KEY);
    if (!tasks) return [];
    try {
      const parsed = JSON.parse(tasks);
      return parsed.map((t) => ({ pinned: t.pinned ?? false, ...t }));
    } catch (e) {
      console.error('Повреждённые данные задач, сброс', e);
      await AsyncStorage.removeItem(TASKS_KEY);
      return [];
    }
  } catch (error) {
    console.error('Ошибка при загрузке задач', error);
    return [];
  }
};

export const saveTask = async (task) => {
  try {
    const tasks = await getTasks();
    tasks.push(task);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    await syncTasks(tasks);
  } catch (error) {
    console.error('Ошибка при сохранении задачи', error);
  }
};

export const updateTaskStatus = async (taskId, newStatus) => {
  try {
    const tasks = await getTasks();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      tasks[index].status = newStatus;
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
      await syncTasks(tasks);
      return tasks[index];
    }
    return null;
  } catch (error) {
    console.error('Ошибка при обновлении статуса задачи', error);
    return null;
  }
};

export const updateTask = async (task) => {
  try {
    const tasks = await getTasks();
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      tasks[index] = task;
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
      await syncTasks(tasks);
    }
  } catch (error) {
    console.error('Ошибка при обновлении задачи', error);
  }
};

export const toggleTaskPinned = async (taskId) => {
  try {
    const tasks = await getTasks();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      tasks[index].pinned = !tasks[index].pinned;
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
      await syncTasks(tasks);
      return tasks[index];
    }
    return null;
  } catch (error) {
    console.error('Ошибка при изменении закрепления задачи', error);
    return null;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const tasks = await getTasks();
    const filteredTasks = tasks.filter((t) => t.id !== taskId);
    const deletedTask = tasks.find((t) => t.id === taskId);
    if (deletedTask?.notificationId) {
      await cancelTaskNotification(deletedTask.notificationId);
    }
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(filteredTasks));
    await syncTasks(filteredTasks);
  } catch (error) {
    console.error('Ошибка при удалении задачи', error);
  }
};

export const saveTasksList = async (tasks) => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    await syncTasks(tasks);
  } catch (error) {
    console.error('Ошибка при сохранении задач', error);
  }
};
