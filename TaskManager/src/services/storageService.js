import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'TASKS';

export const getTasks = async () => {
  try {
    const tasks = await AsyncStorage.getItem(TASKS_KEY);
    return tasks ? JSON.parse(tasks) : [];
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
  } catch (error) {
    console.error('Ошибка при сохранении задачи', error);
  }
};

export const updateTaskStatus = async (taskId, newStatus) => {
  const tasks = await getTasks();
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index !== -1) {
    tasks[index].status = newStatus;
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return tasks[index];
  }
  return null;
};

export const deleteTask = async (taskId) => {
  const tasks = await getTasks();
  const filteredTasks = tasks.filter((t) => t.id !== taskId);
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(filteredTasks));
};
