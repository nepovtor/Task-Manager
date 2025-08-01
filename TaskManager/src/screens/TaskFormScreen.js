import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import storageService from '../services/storageService';
import styles from '../styles/styles';

const TaskFormScreen = ({ navigation, route }) => {
  const editingTask = route.params?.task;
  const [title, setTitle] = useState(editingTask ? editingTask.title : '');
  const [date, setDate] = useState(editingTask ? editingTask.date : '');
  const [status, setStatus] = useState(editingTask ? editingTask.status : 'В процессе');

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Название задачи не может быть пустым!');
      return;
    }
    if (isNaN(Date.parse(date))) {
      Alert.alert('Ошибка', 'Введите корректную дату!');
      return;
    }
    try {
      const tasks = await storageService.getTasks();
      if (editingTask) {
        const updated = tasks.map((t) =>
          t.id === editingTask.id ? { ...t, title, date, status } : t
        );
        await storageService.saveTasks(updated);
      } else {
        const newTask = {
          id: Date.now(),
          title,
          date,
          status,
        };
        await storageService.saveTasks([...tasks, newTask]);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить задачу');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Название задачи"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Дата и время (YYYY-MM-DD HH:mm)"
        value={date}
        onChangeText={setDate}
      />
      <Button title="Сохранить" onPress={handleSave} />
    </View>
  );
};

export default TaskFormScreen;
