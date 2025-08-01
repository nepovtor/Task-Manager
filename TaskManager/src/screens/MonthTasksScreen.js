import React from 'react';
import { View, FlatList } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTasks } from '../context/TaskContext';
import { List, Text } from 'react-native-paper';

export default function MonthTasksScreen({ route }) {
  const { monthOffset = 0, title } = route.params || {};
  const { tasks } = useTasks();
  const paper = useTheme();

  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const month = target.getMonth();
  const year = target.getFullYear();

  const monthTasks = tasks
    .filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <View style={{ flex: 1, backgroundColor: paper.colors.background }}>
      <FlatList
        data={monthTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
            description={new Date(item.date).toLocaleDateString()}
          />
        )}
        ListEmptyComponent={<Text style={{ margin: 16 }}>Нет задач</Text>}
      />
    </View>
  );
}
