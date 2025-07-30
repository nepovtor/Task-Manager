# Task Manager (React Native + Expo)

Мобильное приложение для управления задачами, созданное с использованием **React Native**, **Expo**, **AsyncStorage** и **React Navigation**.

## 🚀 Возможности

- Просмотр списка задач
- Сортировка по дате и статусу
- Добавление и удаление задач
- Изменение статуса задачи
- Просмотр детальной информации
- Сохранение данных в локальном хранилище (AsyncStorage)

---

## 📦 Установка

1. Установите [Node.js](https://nodejs.org/) и [Expo CLI](https://docs.expo.dev/get-started/installation/):
   ```bash
   npm install -g expo-cli
   ```
2. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/your-username/task-manager.git
   cd task-manager
   ```
3. Установите зависимости:
   ```bash
   npm install
   ```

## ▶️ Запуск

```bash
expo start
```

После запуска отсканируйте QR-код в приложении **Expo Go** на вашем устройстве.

## 📱 Сборка APK

1. Войдите в Expo:
   ```bash
   expo login
   ```
2. Соберите проект:
   ```bash
   eas build -p android --profile preview
   ```
3. Скачайте готовый APK из личного кабинета Expo.

## 🛠 Используемые технологии

- React Native
- Expo
- React Navigation
- AsyncStorage
- React Native Paper

