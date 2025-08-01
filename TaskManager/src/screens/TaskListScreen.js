import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { FAB, Appbar, Menu } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { getTasks } from '../services/storageService';
import TaskItem from '../components/TaskItem';
import styles from '../styles/styles';

export default function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [sortType, setSortType] = useState('date'); // date | status
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadTasks();
    }
  }, [isFocused]);

  const loadTasks = async () => {
    const storedTasks = await getTasks();
    setTasks(sortTasks(storedTasks || [], sortType));
  };

  const sortTasks = (tasksArray, type) => {
    if (type === 'status') {
      return [...tasksArray].sort((a, b) => a.status.localeCompare(b.status));
    }
    return [...tasksArray].sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const changeSort = (type) => {
    setSortType(type);
    setTasks(sortTasks(tasks, type));
    setMenuVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Appbar с меню сортировки */}
      <Appbar.Header>
        <Appbar.Content title="Список задач" />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="sort"
              color="white"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item onPress={() => changeSort('date')} title="Сортировать по дате" />
          <Menu.Item onPress={() => changeSort('status')} title="Сортировать по статусу" />
        </Menu>
      </Appbar.Header>

      {/* Список задач */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onPress={() => navigation.navigate('TaskDetail', { task: item })}
          />
        )}
        contentContainerStyle={{ flexGrow: 1 }}
      />

      {/* Кнопка добавления задачи */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('TaskForm')}
      />
    </View>
  );
}
