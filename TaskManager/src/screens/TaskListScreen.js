import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { FAB, Appbar, Menu, Searchbar, Text, Button } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { useTasks } from '../context/TaskContext';
import { useThemePreferences } from '../context/ThemeContext';
import i18n from '../i18n';
import { TASK_STATUSES } from '../constants';
import TaskItem from '../components/TaskItem';
import TaskWidget from '../components/TaskWidget';
import styles from '../styles/styles';

export default function TaskListScreen({ navigation }) {
  const { tasks: storedTasks, togglePin } = useTasks();
  const { theme, toggleTheme } = useThemePreferences();
  const [tasks, setTasks] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [sortType, setSortType] = useState('date'); // date | status
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      updateList();
    }
  }, [isFocused, filterStatus, searchQuery, storedTasks]);

  const updateList = () => {
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
    return [...tasksArray].sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }
      if (type === 'status') {
        return a.status.localeCompare(b.status);
      }
      return new Date(a.date) - new Date(b.date);
    });
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

  const handleTogglePin = async (id) => {
    const updated = await togglePin(id);
    if (updated) {
      setTasks((prev) => sortTasks(prev.map((t) => (t.id === id ? updated : t)), sortType));
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Appbar с меню сортировки */}
      <Appbar.Header>
        <Appbar.Content title={i18n.t('taskList')} />
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
          <Menu.Item onPress={() => changeFilter(TASK_STATUSES[0])} title="Активные" />
          <Menu.Item onPress={() => changeFilter(TASK_STATUSES[1])} title="Завершённые" />
          <Menu.Item onPress={() => changeFilter(TASK_STATUSES[2])} title="Отменённые" />
        </Menu>
        <Appbar.Action
          icon={theme === 'light' ? 'weather-night' : 'white-balance-sunny'}
          color="white"
          onPress={toggleTheme}
        />
      </Appbar.Header>

      <Searchbar
        placeholder={i18n.t('search', { defaultValue: 'Поиск' })}
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{ margin: 8 }}
      />

      <TaskWidget tasks={tasks} />

      {/* Список задач или пустое состояние */}
      {tasks.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>{i18n.t('noTasks')}</Text>
          <Button mode="contained" onPress={() => navigation.navigate('TaskForm')} style={{ marginTop: 16 }}>
            {i18n.t('createTask')}
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
              onToggle={() => handleTogglePin(item.id)}
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
