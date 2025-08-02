import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { RadioButton, List, useTheme, Button, Snackbar } from 'react-native-paper';
import { useThemePreferences } from '../context/ThemeContext';
import { TASK_STATUSES } from '../constants';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { accentColor, setAccentColor } = useThemePreferences();
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
        <List.Accordion title="Отображение" left={(props) => <List.Icon {...props} icon="palette" />}>
          <RadioButton.Group onValueChange={setAccentColor} value={accentColor}>
            {colors.map((c) => (
              <RadioButton.Item key={c} label={c} value={c} color={c} />
            ))}
          </RadioButton.Group>
        </List.Accordion>

        <List.Accordion
          title="Управление задачами"
          left={(props) => <List.Icon {...props} icon="format-list-bulleted" />}
        >
          {TASK_STATUSES.map((s) => (
            <List.Item
              key={s}
              title={s}
              left={() => (
                <List.Icon
                  color={s === 'Завершена' ? 'green' : s === 'Отменена' ? 'gray' : 'blue'}
                  icon="circle"
                />
              )}
            />
          ))}
        </List.Accordion>

        <List.Accordion title="Уведомления" left={(props) => <List.Icon {...props} icon="bell" />}>
          <List.Item
            title={notifStatus === 'granted' ? 'Уведомления включены' : 'Уведомления отключены'}
            onPress={() => Linking.openSettings()}
            left={() => <List.Icon icon="open-in-new" />}
          />
        </List.Accordion>

        <List.Accordion title="Система" left={(props) => <List.Icon {...props} icon="cog" />}>
          <Button mode="outlined" onPress={resetSettings} style={{ margin: 8 }}>
            Сбросить настройки
          </Button>
        </List.Accordion>
      </List.Section>

      <Snackbar visible={!!snackbar} onDismiss={() => setSnackbar('')} duration={1500}>
        {snackbar}
      </Snackbar>
    </View>
  );
}
