import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { FAB, Appbar, Menu, Searchbar, Text, Button } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { getTasks } from '../services/storageService';
import TaskItem from '../components/TaskItem';
import TaskWidget from '../components/TaskWidget';
import styles from '../styles/styles';

export default function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [sortType, setSortType] = useState('date'); // date | status
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadTasks();
    }
  }, [isFocused, filterStatus, searchQuery]);

  const loadTasks = async () => {
    const storedTasks = await getTasks();
    let list = storedTasks || [];
    if (filterStatus !== 'all') {
      list = list.filter((t) => t.status === filterStatus);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q));
    }
    setTasks(sortTasks(list, sortType));
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

  const changeFilter = (status) => {
    setFilterStatus(status);
    setFilterMenuVisible(false);
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
        <Menu
          visible={filterMenuVisible}
          onDismiss={() => setFilterMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="filter"
              color="white"
              onPress={() => setFilterMenuVisible(true)}
            />
          }
        >
          <Menu.Item onPress={() => changeFilter('all')} title="Все" />
          <Menu.Item onPress={() => changeFilter('В процессе')} title="Активные" />
          <Menu.Item onPress={() => changeFilter('Завершена')} title="Завершённые" />
          <Menu.Item onPress={() => changeFilter('Отменена')} title="Отменённые" />
        </Menu>
      </Appbar.Header>

      <Searchbar
        placeholder="Поиск"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{ margin: 8 }}
      />

      <TaskWidget tasks={tasks} />

      {/* Список задач или пустое состояние */}
      {tasks.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Нет задач</Text>
          <Button mode="contained" onPress={() => navigation.navigate('TaskForm')} style={{ marginTop: 16 }}>
            Создать задачу
          </Button>
        </View>
      ) : (
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
      )}

      {/* Кнопка добавления задачи */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('TaskForm')}
      />
    </View>
  );
}
