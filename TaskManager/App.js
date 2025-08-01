import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { registerForPushNotificationsAsync } from './src/services/notificationService';

export default function App() {
  useEffect(() => {
    // Запрос разрешений на уведомления
    registerForPushNotificationsAsync();

    // Настройка поведения уведомлений
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
}
