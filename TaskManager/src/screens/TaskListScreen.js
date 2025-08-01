import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { FAB } from 'react-native-paper';
import TaskItem from '../components/TaskItem';
import storageService from '../services/storageService';
import styles from '../styles/styles';

const order = { 'В процессе': 1, 'Завершена': 2, 'Отменена': 3 };

const TaskListScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const data = await storageService.getTasks();
      setTasks(data);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить задачи');
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === id
          ? { ...task, status: task.status === 'В процессе' ? 'Завершена' : 'В процессе' }
          : task
      );
      setTasks(updatedTasks);
      await storageService.saveTasks(updatedTasks);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось изменить статус задачи');
    }
  };

  // Сортировка по статусу
  const sortedTasks = [...tasks].sort(
    (a, b) => (order[a.status] || 99) - (order[b.status] || 99)
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            navigation={navigation}
            onToggle={() => handleToggleStatus(item.id)}
          />
        )}
      />
      <FAB
        icon="plus"
        style={styles.addButton}
        onPress={() => navigation.navigate('TaskForm')}
      />
    </View>
  );
};

export default TaskListScreen;
