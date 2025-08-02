import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, Button, Checkbox, ProgressBar } from 'react-native-paper';
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

  const toggleSubtask = async (id) => {
    const updated = {
      ...currentTask,
      subtasks: currentTask.subtasks.map((st) =>
        st.id === id ? { ...st, done: !st.done } : st
      ),
    };
    setCurrentTask(updated);
    await updateTask(updated);
  };

  const completed = currentTask.subtasks?.filter((s) => s.done).length || 0;
  const total = currentTask.subtasks?.length || 0;

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: paperTheme.colors.background }}>
      <Text variant="titleLarge">{currentTask.title}</Text>
      <Text>{currentTask.description}</Text>
      <Text>Дата: {formatDate(currentTask.date)}</Text>
      <Text>Адрес: {currentTask.address}</Text>
      <Text>Категория: {currentTask.category}</Text>
      <Text>Статус: {currentTask.status}</Text>
      <Text>Приоритет: {currentTask.priority}</Text>

      {total > 0 && (
        <View style={{ marginVertical: 8 }}>
          <ProgressBar progress={completed / total} style={{ marginBottom: 8 }} />
          {currentTask.subtasks.map((st) => (
            <View key={st.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                status={st.done ? 'checked' : 'unchecked'}
                onPress={() => toggleSubtask(st.id)}
              />
              <Text>{st.title}</Text>
            </View>
          ))}
        </View>
      )}

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
