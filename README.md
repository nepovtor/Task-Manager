# 📱 Task Manager - React Native App

<div align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.74.0-blue.svg" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-~51.0.0-black.svg" alt="Expo" />
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-green.svg" alt="Platform" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License" />
</div>

<br />

Современное мобильное приложение для управления задачами, разработанное с использованием **React Native**, **Expo** и **React Navigation**. Приложение поддерживает кроссплатформенную разработку для iOS, Android и Web.

## ✨ Основные возможности

- 📋 **Управление задачами** - создание, редактирование и удаление задач
- 🔍 **Детальный просмотр** - подробная информация о каждой задаче
- 📊 **Сортировка и фильтрация** - по дате создания и статусу выполнения
- 💾 **Локальное хранение** - сохранение данных с помощью AsyncStorage
- 🎨 **Современный UI** - Material Design с React Native Paper
- 📱 **Адаптивный дизайн** - оптимизировано для всех размеров экранов
- 🛡️ **Поддержка Safe Area** - корректное отображение на устройствах с вырезами
- ⚡ **Быстрая навигация** - плавные переходы между экранами
- ☁️ **Синхронизация через Supabase** - облачное хранение задач
- 🔑 **Авторизация через Google** - вход с помощью Expo Auth Session
- 🔔 **Push-уведомления** - напоминания о предстоящих задачах
  
  > Начиная с Expo SDK 53 удалена поддержка удалённых уведомлений в **Expo Go**.
  > Для корректной работы Push-уведомлений используйте development build
  > (см. раздел «Тестирование на устройстве»).

## 🏗️ Архитектура проекта

```
TaskManager/
├── src/
│   ├── navigation/          # Навигация приложения
│   │   └── AppNavigator.js  # Основной навигатор
│   ├── screens/             # Экраны приложения
│   │   ├── TaskListScreen.js    # Список задач
│   │   ├── TaskFormScreen.js    # Создание/редактирование
│   │   ├── TaskDetailScreen.js  # Детали задачи
│   │   └── SignInScreen.js      # Вход пользователя
│   ├── services/            # Сервисы
│   │   ├── storageService.js    # Работа с локальным хранилищем
│   │   ├── authService.js       # Авторизация
│   │   ├── notificationService.js # Push-уведомления
│   │   └── supabaseService.js   # Синхронизация с облаком
│   └── styles/              # Стили приложения
├── App.js                   # Точка входа
├── package.json            # Зависимости
└── babel.config.js         # Конфигурация Babel
```

## 🛠️ Технологический стек

| Технология | Версия | Назначение |
|------------|--------|------------|
| **React Native** | 0.74.0 | Основной фреймворк |
| **Expo** | ~51.0.0 | Платформа разработки |
| **React Navigation** | ^6.1.6 | Навигация |
| **React Native Paper** | ^5.12.3 | UI компоненты |
| **AsyncStorage** | ^1.21.0 | Локальное хранение |
| **React Native Reanimated** | ~3.10.0 | Анимации |
| **Expo Notifications** | ~0.31.4 | Push-уведомления |
| **Expo Auth Session** | ^6.2.1 | Авторизация через Google |
| **Supabase JS** | ^2.53.0 | Синхронизация данных |

## 🚀 Быстрый старт

### Предварительные требования

- [Node.js](https://nodejs.org/) (версия 16 или выше)
- [Git](https://git-scm.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Установка

1. **Клонируйте репозиторий**
   ```bash
   git clone https://github.com/your-username/task-manager.git
   cd task-manager/TaskManager
   ```

2. **Установите зависимости**
   ```bash
   npm install
   ```

3. **Запустите приложение**
   ```bash
   # Для разработки
   npx expo start
   
   # Для веб-версии
   npx expo start --web
   
   # Для Android эмулятора
   npx expo start --android
   
   # Для iOS симулятора
   npx expo start --ios
   ```

### 📱 Тестирование на устройстве

1. Установите приложение [Expo Go](https://expo.dev/client) на ваш телефон
2. Отсканируйте QR-код, который появится в терминале
3. Приложение автоматически загрузится на вашем устройстве

> Для полноценной работы Push-уведомлений начиная с SDK 53 используйте
> development build.

```bash
eas build -p android --profile development    # или ios
npx expo start --dev-client
```

## 🎯 Функциональность

### Основные экраны

1. **Список задач** (`TaskListScreen`)
   - Отображение всех задач
   - Сортировка по дате и статусу
   - Быстрые действия (просмотр, редактирование)

2. **Форма задачи** (`TaskFormScreen`)
   - Создание новых задач
   - Редактирование существующих
   - Валидация полей

3. **Детали задачи** (`TaskDetailScreen`)
   - Подробная информация
   - Изменение статуса
   - Дополнительные действия

### Статусы задач

- 🔄 **В процессе** - активные задачи
- ✅ **Завершена** - выполненные задачи  
- ❌ **Отменена** - отмененные задачи

## 📱 Сборка для продакшена

### Android APK

```bash
# Установите EAS CLI
npm install -g @expo/eas-cli

# Войдите в аккаунт Expo
eas login

# Соберите APK
eas build -p android --profile preview
```

### iOS App

```bash
# Соберите для iOS
eas build -p ios --profile preview
```

## 🧪 Тестирование

```bash
# Запуск тестов (если настроены)
npm test

# Проверка линтинга
npm run lint
```

## 🔧 Настройка разработки

### Рекомендуемые инструменты

- **VS Code** с расширениями:
  - React Native Tools
  - ES7+ React/Redux/React-Native snippets
  - Prettier
  - ESLint

### Переменные окружения

Создайте файл `.env` в корне проекта:

```env
EXPO_PUBLIC_API_URL=your_api_url_here
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 📚 Полезные команды

```bash
# Очистка кеша Expo
npx expo start --clear

# Просмотр логов
npx expo logs

# Проверка конфигурации
npx expo doctor

# Обновление зависимостей
npx expo upgrade
```

## 🤝 Участие в разработке

1. Форкните репозиторий
2. Создайте ветку для фичи (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📝 Changelog

### [1.0.0] - 2024-01-15
- ✨ Первый релиз приложения
- 📱 Основной функционал управления задачами
- 💾 Локальное хранение данных
- 🎨 Material Design интерфейс

## 🐛 Известные проблемы

- Web версия может иметь ограничения в работе с AsyncStorage
- На старых версиях Android возможны проблемы с анимациями

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 👨‍💻 Автор

**Ваше Имя**
- GitHub: [@your-username](https://github.com/your-username)
- Email: your.email@example.com

## 🙏 Благодарности

- [Expo Team](https://expo.dev/) за отличную платформу разработки
- [React Native Community](https://reactnative.dev/) за мощный фреймворк
- [Material Design](https://material.io/) за прекрасные UI принципы

---

<div align="center">
  Сделано с ❤️ для управления задачами
</div>

