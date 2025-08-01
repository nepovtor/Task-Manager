import React, { useState } from 'react';
import { View, SectionList, Platform } from 'react-native';
import { useTheme, Appbar, FAB, List, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useTasks } from '../context/TaskContext';
import { TASK_STATUSES } from '../constants';
import styles from '../styles/styles';

export default function MonthTasksScreen({ route, navigation }) {
  const { monthOffset = 0 } = route.params || {};
  const { tasks } = useTasks();
  const paper = useTheme();

  const initial = new Date();
  initial.setMonth(initial.getMonth() + monthOffset, 1);

  const [monthDate, setMonthDate] = useState(initial);
  const [showPicker, setShowPicker] = useState(false);

  const month = monthDate.getMonth();
  const year = monthDate.getFullYear();

  const monthTasks = tasks
    .filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const sections = TASK_STATUSES.map((status) => ({
    title: status,
    data: monthTasks.filter((t) => t.status === status),
  }));

  const monthLabel = monthDate.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric',
  });

  const onChangeDate = (_, selected) => {
    setShowPicker(false);
    if (selected) {
      selected.setDate(1);
      setMonthDate(selected);
    }
  };

  const exportPdf = async () => {
    const html = `<h1>Задачи ${monthLabel}</h1><ul>` +
      monthTasks
        .map(
          (t) =>
            `<li>${new Date(t.date).toLocaleDateString()} - ${t.title} - ${t.status}</li>`,
        )
        .join('') +
      '</ul>';
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  const exportCsv = async () => {
    const csv =
      'Title,Date,Status\n' +
      monthTasks
        .map(
          (t) =>
            `${t.title.replace(/,/g, ' ')},${new Date(t.date).toLocaleDateString()},${t.status}`,
        )
        .join('\n');
    const fileUri = `${FileSystem.cacheDirectory}tasks-${year}-${month + 1}.csv`;
    await FileSystem.writeAsStringAsync(fileUri, csv);
    await Sharing.shareAsync(fileUri);
  };

  const highlightStyle = (date) => {
    const today = new Date();
    const d = new Date(date);
    if (d.toDateString() === today.toDateString()) {
      return { backgroundColor: '#e3f2fd' };
    }
    return null;
  };

  return (
    <View style={{ flex: 1, backgroundColor: paper.colors.background }}>
      <Appbar.Header>
        <Appbar.Action icon="calendar-month" onPress={() => setShowPicker(true)} />
        <Appbar.Content title={monthLabel} />
        <Appbar.Action icon="file-pdf-box" onPress={exportPdf} />
        <Appbar.Action icon="file-excel" onPress={exportCsv} />
      </Appbar.Header>
      {showPicker && (
        <DateTimePicker
          value={monthDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
          onChange={onChangeDate}
        />
      )}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
            description={new Date(item.date).toLocaleDateString()}
            style={highlightStyle(item.date)}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <List.Subheader>{title}</List.Subheader>
        )}
        ListEmptyComponent={<Text style={{ margin: 16 }}>Нет задач</Text>}
      />
      <FAB
        style={[styles.fab, { backgroundColor: paper.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('TaskForm')}
      />
    </View>
  );
}
