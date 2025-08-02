import React, { useState, useRef, useEffect } from 'react';
import { View, SectionList, Platform, LayoutAnimation } from 'react-native';
import { useTheme, Appbar, FAB, List, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useTasks } from '../context/TaskContext';
import { TASK_STATUSES } from '../constants';
import styles from '../styles/styles';
import MiniCalendar from '../components/MiniCalendar';

export default function MonthTasksScreen({ route, navigation }) {
  const { monthOffset = 0 } = route.params || {};
  const { tasks } = useTasks();
  const paper = useTheme();

  const initial = new Date();
  initial.setMonth(initial.getMonth() + monthOffset, 1);

  const [monthDate, setMonthDate] = useState(initial);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [monthTasks, setMonthTasks] = useState([]);
  const cacheRef = useRef({});

  const month = monthDate.getMonth();
  const year = monthDate.getFullYear();

  useEffect(() => {
    cacheRef.current = {};
  }, [tasks]);

  useEffect(() => {
    const key = `${year}-${month}`;
    if (cacheRef.current[key]) {
      setMonthTasks(cacheRef.current[key]);
    } else {
      const data = tasks
        .filter((t) => {
          const d = new Date(t.date);
          return d.getMonth() === month && d.getFullYear() === year;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      cacheRef.current[key] = data;
      setMonthTasks(data);
    }
  }, [tasks, month, year]);

  const displayTasks =
    selectedDates.length > 0
      ? monthTasks.filter((t) =>
          selectedDates.includes(
            new Date(t.date).toISOString().split('T')[0],
          ),
        )
      : monthTasks;

  const sections = TASK_STATUSES.map((status) => ({
    title: status,
    data: displayTasks.filter((t) => t.status === status),
  }));

  const monthLabel = monthDate.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric',
  });

  const onChangeDate = (_, selected) => {
    setShowPicker(false);
    if (selected) {
      selected.setDate(1);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
    const d = new Date(date);
    const dayString = d.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    if (dayString === today || selectedDates.includes(dayString)) {
      return { backgroundColor: paper.colors.surfaceVariant };
    }
    return null;
  };

  return (
    <View style={{ flex: 1, backgroundColor: paper.colors.background }}>
      <Appbar.Header>
        <Appbar.Action icon="calendar-month" onPress={() => setShowPicker(true)} />
        <Appbar.Content title={monthLabel} />
        <Appbar.Action
          icon="calendar-today"
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );
            const now = new Date();
            now.setDate(1);
            setMonthDate(now);
            setSelectedDates([]);
          }}
        />
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
      <MiniCalendar
        tasks={monthTasks}
        monthDate={monthDate}
        selectedDates={selectedDates}
        onSelectDate={(d) =>
          setSelectedDates((prev) =>
            prev.includes(d) ? prev.filter((p) => p !== d) : [...prev, d],
          )
        }
        onChangeMonth={(d) => {
          LayoutAnimation.configureNext(
            LayoutAnimation.Presets.easeInEaseOut,
          );
          setMonthDate(d);
          setSelectedDates([]);
        }}
      />
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
