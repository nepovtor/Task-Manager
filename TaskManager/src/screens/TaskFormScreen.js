import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { getTasks, saveTasks } from '../services/storageService';
import styles from '../styles/styles';

export default function TaskFormScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');

  const saveTask = async () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Введите заголовок задачи');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      date,
      address,
      status: 'В процессе',
    };

    const tasks = (await getTasks()) || [];
    tasks.push(newTask);
    await saveTasks(tasks);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput label="Заголовок" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput label="Описание" value={description} onChangeText={setDescription} style={styles.input} />
      <TextInput label="Дата и время" value={date} onChangeText={setDate} style={styles.input} />
      <TextInput label="Адрес" value={address} onChangeText={setAddress} style={styles.input} />
      <Button mode="contained" onPress={saveTask} style={styles.saveButton}>
        Сохранить
      </Button>
    </View>
  );
}
