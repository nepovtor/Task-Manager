import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Constants from 'expo-constants';

export default function AboutScreen() {
  const theme = useTheme();
  const version = Constants.expoConfig?.version || '1.0.0';
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.colors.background }}>
      <Text variant="titleLarge" style={{ marginBottom: 8, textAlign: 'center' }}>
        О приложении
      </Text>
      <Text style={{ textAlign: 'center' }}>Версия: {version}</Text>
      <Text style={{ marginTop: 8, textAlign: 'center' }}>
        Task Manager — приложение для планирования и отслеживания задач.
        Создавайте задания, получайте напоминания и контролируйте прогресс.
      </Text>
    </View>
  );
}
