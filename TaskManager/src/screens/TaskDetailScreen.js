import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { updateTaskStatus, deleteTask } from '../services/storageService';

export default function TaskDetailScreen({ route, navigation }) {
  const { task } = route.params;
  const [currentTask, setCurrentTask] = useState(task);

  const handleStatusChange = async () => {
    const statuses = ['В процессе', 'Завершена', 'Отменена'];
    const nextStatus = statuses[(statuses.indexOf(currentTask.status) + 1) % statuses.length];
    const updatedTask = await updateTaskStatus(currentTask.id, nextStatus);
    setCurrentTask(updatedTask);
  };

  const handleDelete = async () => {
    await deleteTask(currentTask.id);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="titleLarge">{currentTask.title}</Text>
      <Text>{currentTask.description}</Text>
      <Text>Дата: {currentTask.date}</Text>
      <Text>Адрес: {currentTask.address}</Text>
      <Text>Статус: {currentTask.status}</Text>

      <Button mode="contained" onPress={handleStatusChange} style={{ marginVertical: 8 }}>
        Изменить статус
      </Button>

      <Button mode="contained" onPress={handleDelete} buttonColor="red">
        Удалить задачу
      </Button>
    </View>
  );
}
