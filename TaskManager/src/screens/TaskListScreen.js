import React, { useState, useCallback } from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from 'react-native-paper';
import { getTasks } from '../services/storageService';
import TaskItem from '../components/TaskItem';
import styles from '../styles/styles';
import { useFocusEffect, useRoute } from '@react-navigation/native';

export default function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [sortType, setSortType] = useState('date'); // date | status
  const route = useRoute();

  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(sortTasks(data, sortType));
  };

  const sortTasks = (tasks, type) => {
    if (type === 'date') {
      return [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (type === 'status') {
      const order = { 'В процессе': 1, 'Завершена': 2, 'Отменена': 3 };
      return [...tasks].sort((a, b) => (order[a.status] || 4) - (order[b.status] || 4));
    }
    return tasks;
  };

  const handleSort = (type) => {
    setSortType(type);
    setTasks(sortTasks(tasks, type));
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [route.params?.refresh])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
        <Button
          mode={sortType === 'date' ? 'contained' : 'outlined'}
          onPress={() => handleSort('date')}
        >
          Сортировать по дате
        </Button>
        <Button
          mode={sortType === 'status' ? 'contained' : 'outlined'}
          onPress={() => handleSort('status')}
        >
          Сортировать по статусу
        </Button>
      </View>

      {tasks.length === 0 ? (
        <Text style={{ textAlign: 'center', marginVertical: 20 }}>Задач нет</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TaskItem task={item} navigation={navigation} />
          )}
        />
      )}

      <Button
        mode="contained"
        onPress={() => navigation.navigate('TaskForm')}
        style={{ marginTop: 20 }}
      >
        Добавить задачу
      </Button>
    </SafeAreaView>
  );
}
