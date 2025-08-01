import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import storageService from '../services/storageService';
import styles from '../styles/styles';

const TaskDetailScreen = ({ route, navigation }) => {
  const { task } = route.params || {};
  if (!task) {
    return (
      <View style={styles.container}>
        <Text>Задача не найдена.</Text>
      </View>
    );
  }

  const handleDelete = async () => {
    try {
      const tasks = await storageService.getTasks();
      const updated = tasks.filter((t) => t.id !== task.id);
      await storageService.saveTasks(updated);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить задачу');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <Text>Дата: {task.date}</Text>
      <Text>Статус: {task.status}</Text>
      <Button
        title="Редактировать"
        onPress={() => navigation.navigate('TaskForm', { task })}
      />
      <Button title="Удалить" color="#DC2626" onPress={handleDelete} />
    </View>
  );
};

export default TaskDetailScreen;
