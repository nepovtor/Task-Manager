import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Объявляем переводы
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

// Разрешить fallback при отсутствии перевода
i18n.fallbacks = true;

// Безопасная установка языка
const locale = typeof Localization.locale === 'string' ? Localization.locale.split('-')[0] : 'en';
i18n.locale = locale;

export default i18n;
