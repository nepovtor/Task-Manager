import React, { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { registerForPushNotificationsAsync } from './src/services/notificationService';
import SignInScreen from './src/screens/SignInScreen';

export default function App() {
  const [user, setUser] = useState(null);
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
      {user ? (
        <AppNavigator />
      ) : (
        <SignInScreen onSignIn={setUser} />
      )}
    </PaperProvider>
  );
}
