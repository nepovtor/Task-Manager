import React from 'react';
import { View } from 'react-native';
import { Text, RadioButton, List, useTheme } from 'react-native-paper';
import { useThemePreferences } from '../context/ThemeContext';
import { TASK_STATUSES } from '../constants';

export default function SettingsScreen() {
  const { accentColor, setAccentColor } = useThemePreferences();
  const theme = useTheme();
  const colors = ['#6750A4', '#ff5722', '#009688'];

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.colors.background }}>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>Статусы</Text>
      {TASK_STATUSES.map((s) => (
        <List.Item
          key={s}
          title={s}
          left={() => (
            <List.Icon color={s === 'Завершена' ? 'green' : s === 'Отменена' ? 'gray' : 'blue'} icon="circle" />
          )}
        />
      ))}
      <Text variant="titleLarge" style={{ marginVertical: 16 }}>Акцентный цвет</Text>
      <RadioButton.Group onValueChange={setAccentColor} value={accentColor}>
        {colors.map((c) => (
          <RadioButton.Item key={c} label={c} value={c} color={c} />
        ))}
      </RadioButton.Group>
    </View>
  );
}
