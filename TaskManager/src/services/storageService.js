import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'TASKS';

const storageService = {
  getTasks: async () => {
    try {
      const json = await AsyncStorage.getItem(TASKS_KEY);
      return json ? JSON.parse(json) : [];
    } catch (error) {
      throw new Error('Ошибка чтения задач');
    }
  },
  saveTasks: async (tasks) => {
    try {
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      throw new Error('Ошибка сохранения задач');
    }
  },
};

export default storageService;
