import React, { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Provider as PaperProvider, ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { RobotoFlex_400Regular, RobotoFlex_500Medium } from '@expo-google-fonts/roboto-flex';
import AppNavigator from './src/navigation/AppNavigator';
import { registerForPushNotificationsAsync } from './src/services/notificationService';
import { TaskProvider } from './src/context/TaskContext';
import { ThemeProvider, useThemePreferences } from './src/context/ThemeContext';
import SignInScreen from './src/screens/SignInScreen';

function MainApp() {
  const [user, setUser] = useState(null);
  const { paperTheme } = useThemePreferences();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    RobotoFlex_400Regular,
    RobotoFlex_500Medium,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

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
