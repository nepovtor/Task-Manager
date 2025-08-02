import React, { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { registerForPushNotificationsAsync } from './src/services/notificationService';
import { TaskProvider } from './src/context/TaskContext';
import { ThemeProvider, useThemePreferences } from './src/context/ThemeContext';
import SignInScreen from './src/screens/SignInScreen';

function MainApp() {
  const [user, setUser] = useState(null);
  const { paperTheme } = useThemePreferences();

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
    <PaperProvider theme={paperTheme}>
      <StatusBar style={paperTheme.dark ? 'light' : 'dark'} />
      <TaskProvider>
        {user ? <AppNavigator /> : <SignInScreen onSignIn={setUser} />}
      </TaskProvider>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
