import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useThemePreferences } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';
import { TASK_STATUSES } from '../constants';
import formatDate from '../utils/formatDate';

export default function TaskDetailScreen({ route, navigation }) {
  const { updateStatus, deleteTask } = useTasks();
  const { paperTheme } = useThemePreferences();
  const { task } = route.params;
  const [currentTask, setCurrentTask] = useState(task);

  const handleStatusChange = async () => {
    const nextStatus = TASK_STATUSES[(TASK_STATUSES.indexOf(currentTask.status) + 1) % TASK_STATUSES.length];
    await updateStatus(currentTask.id, nextStatus);
    setCurrentTask((prev) => ({ ...prev, status: nextStatus }));
  };

  const handleDelete = async () => {
    await deleteTask(currentTask.id);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: paperTheme.colors.background }}>
      <Text variant="titleLarge">{currentTask.title}</Text>
      <Text>{currentTask.description}</Text>
      <Text>Дата: {formatDate(currentTask.date)}</Text>
      <Text>Адрес: {currentTask.address}</Text>
      <Text>Категория: {currentTask.category}</Text>
      <Text>Статус: {currentTask.status}</Text>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('TaskForm', { task: currentTask })}
        style={{ marginVertical: 8 }}
      >
        Редактировать
      </Button>

      <Button mode="contained" onPress={handleStatusChange} style={{ marginVertical: 8 }}>
        Изменить статус
      </Button>

      <Button mode="contained" onPress={handleDelete} buttonColor="red">
        Удалить задачу
      </Button>
    </View>
  );
}
