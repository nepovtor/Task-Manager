import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text, RadioButton, List, useTheme, Button, Snackbar } from 'react-native-paper';
import { useThemePreferences } from '../context/ThemeContext';
import { TASK_STATUSES } from '../constants';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { accentColor, setAccentColor, toggleTheme, theme } = useThemePreferences();
  const paper = useTheme();
  const colors = ['#6750A4', '#ff5722', '#009688'];
  const [notifStatus, setNotifStatus] = useState('unknown');
  const [snackbar, setSnackbar] = useState('');

  useEffect(() => {
    Notifications.getPermissionsAsync().then((res) => setNotifStatus(res.status));
  }, []);

  const resetSettings = async () => {
    await AsyncStorage.multiRemove(['APP_THEME', 'ACCENT_COLOR']);
    setSnackbar('Настройки сброшены');
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: paper.colors.background }}>
      <List.Section>
        <List.Subheader>Отображение</List.Subheader>
        <List.Item
          title={theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
          onPress={() => {
            toggleTheme();
            setSnackbar('Тема изменена');
          }}
          left={() => <List.Icon icon="theme-light-dark" />}
        />
        <RadioButton.Group onValueChange={setAccentColor} value={accentColor}>
          {colors.map((c) => (
            <RadioButton.Item key={c} label={c} value={c} color={c} />
          ))}
        </RadioButton.Group>
      </List.Section>

      <List.Section>
        <List.Subheader>Управление задачами</List.Subheader>
        {TASK_STATUSES.map((s) => (
          <List.Item
            key={s}
            title={s}
            left={() => (
              <List.Icon color={s === 'Завершена' ? 'green' : s === 'Отменена' ? 'gray' : 'blue'} icon="circle" />
            )}
          />
        ))}
      </List.Section>

      <List.Section>
        <List.Subheader>Система</List.Subheader>
        <List.Item
          title={notifStatus === 'granted' ? 'Уведомления включены' : 'Уведомления отключены'}
          onPress={() => Linking.openSettings()}
          left={() => <List.Icon icon="bell" />}
        />
        <Button mode="outlined" onPress={resetSettings} style={{ marginTop: 8 }}>
          Сбросить настройки
        </Button>
      </List.Section>

      <Snackbar visible={!!snackbar} onDismiss={() => setSnackbar('')} duration={1500}>
        {snackbar}
      </Snackbar>
    </View>
  );
}
