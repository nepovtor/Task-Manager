import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Text, Button, Card, IconButton } from 'react-native-paper';
import { getTasks, saveTasks } from '../services/storageService';
import styles from '../styles/styles';

export default function TaskDetailScreen({ route, navigation }) {
  const { task } = route.params;
  const [currentTask, setCurrentTask] = useState(task);

  const updateTaskStatus = async (status) => {
    const tasks = await getTasks();
    const updatedTasks = tasks.map((t) =>
      t.id === currentTask.id ? { ...t, status } : t
    );
    await saveTasks(updatedTasks);
    setCurrentTask({ ...currentTask, status });

    // Передаём сигнал на обновление в TaskListScreen
    navigation.navigate('TaskList', { refresh: true });
  };

  const deleteTask = async () => {
    Alert.alert('Удалить задачу', 'Вы уверены?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          const tasks = await getTasks();
          const updatedTasks = tasks.filter((t) => t.id !== currentTask.id);
          await saveTasks(updatedTasks);

          navigation.navigate('TaskList', { refresh: true });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Text style={styles.detailTitle}>{currentTask.title}</Text>
          <Text>Описание: {currentTask.description}</Text>
          <Text>Дата и время: {currentTask.date}</Text>
          <Text>Адрес: {currentTask.address}</Text>
          <Text>Статус: {currentTask.status}</Text>
        </Card.Content>
      </Card>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 }}>
        <IconButton icon="check" onPress={() => updateTaskStatus('Завершена')} />
        <IconButton icon="progress-clock" onPress={() => updateTaskStatus('В процессе')} />
        <IconButton icon="close" onPress={() => updateTaskStatus('Отменена')} />
      </View>

      <Button mode="contained" onPress={deleteTask} style={styles.deleteButton}>
        Удалить
      </Button>
    </View>
  );
}
