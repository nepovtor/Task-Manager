import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

const i18n = new I18n({
  en: {
    taskList: 'Task List',
    noTasks: 'No tasks',
    createTask: 'Create task',
    search: 'Search',
    edit: 'Edit',
    newTask: 'New Task',
    taskDetails: 'Task Details',
  },
  ru: {
    taskList: 'Список задач',
    noTasks: 'Нет задач',
    createTask: 'Создать задачу',
    search: 'Поиск',
    edit: 'Редактирование',
    newTask: 'Новая задача',
    taskDetails: 'Детали задачи',
  },
});

i18n.fallbacks = true;
i18n.locale = Localization.locale;

export default i18n;
