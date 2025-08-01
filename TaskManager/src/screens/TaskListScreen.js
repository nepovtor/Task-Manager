import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated } from 'react-native';
import { FAB, Appbar, Menu, Searchbar, Text, Button, Divider, Snackbar } from 'react-native-paper';
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
  const { theme, toggleTheme, paperTheme } = useThemePreferences();
  const [tasks, setTasks] = useState([]);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const [snackbar, setSnackbar] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [sortType, setSortType] = useState('date'); // date | status
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState(i18n.locale);
  const isFocused = useIsFocused();

  useEffect(() => {
    Animated.timing(anim, {
      toValue: settingsVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [settingsVisible]);

  useEffect(() => {
    if (isFocused) {
      updateList();
    }
  }, [isFocused, filterStatus, searchQuery, storedTasks, sortType]);

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
    setSettingsVisible(false);
  };

  const changeFilter = (status) => {
    setFilterStatus(status);
    setSettingsVisible(false);
  };

  const handleTogglePin = async (id) => {
    const updated = await togglePin(id);
    if (updated) {
      setTasks((prev) => sortTasks(prev.map((t) => (t.id === id ? updated : t)), sortType));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: paperTheme.colors.background }}>
      {/* Appbar с меню сортировки */}
      <Appbar.Header style={{ height: 48 }}>
        <Appbar.Action
          icon={theme === 'light' ? 'weather-night' : 'white-balance-sunny'}
          onPress={() => {
            toggleTheme();
            setSnackbar('Тема изменена');
          }}
        />
        <Appbar.Content title={i18n.t('taskList')} />
        <Menu
          visible={settingsVisible}
          onDismiss={() => setSettingsVisible(false)}
          anchor={
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '90deg'],
                    }),
                  },
                ],
              }}
            >
              <Appbar.Action icon="hexagon-outline" onPress={() => setSettingsVisible(true)} />
            </Animated.View>
          }
        >
          <Menu.Item title="Отображение" disabled />
          <Menu.Item
            onPress={() => {
              toggleTheme();
              setSnackbar('Тема изменена');
            }}
            title={theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
          />
          <Menu.Item
            onPress={() => {
              const lang = language === 'ru' ? 'en' : 'ru';
              i18n.locale = lang;
              setLanguage(lang);
              setSnackbar('Язык переключен');
            }}
            title={language === 'ru' ? 'Switch to English' : 'Переключить на русский'}
          />
          <Divider />
          <Menu.Item title="Управление задачами" disabled />
          <Menu.Item onPress={() => changeSort('date')} title="Сортировать по дате" />
          <Menu.Item onPress={() => changeSort('status')} title="Сортировать по статусу" />
          <Menu.Item onPress={() => changeFilter('all')} title="Все" />
          <Menu.Item onPress={() => changeFilter(TASK_STATUSES[0])} title="Активные" />
          <Menu.Item onPress={() => changeFilter(TASK_STATUSES[1])} title="Завершённые" />
          <Menu.Item onPress={() => changeFilter(TASK_STATUSES[2])} title="Отменённые" />
          <Divider />
          <Menu.Item title="По месяцам" disabled />
          <Menu.Item
            onPress={() => {
              setSettingsVisible(false);
              navigation.navigate('MonthTasks', {
                monthOffset: 0,
                title: 'Этот месяц',
              });
            }}
            title="Этот месяц"
          />
          <Menu.Item
            onPress={() => {
              setSettingsVisible(false);
              navigation.navigate('MonthTasks', {
                monthOffset: 1,
                title: 'Следующий месяц',
              });
            }}
            title="Следующий месяц"
          />
          <Divider />
          <Menu.Item title="Система" disabled />
          <Menu.Item onPress={() => setNotificationsEnabled(!notificationsEnabled)} title={notificationsEnabled ? 'Отключить уведомления' : 'Включить уведомления'} />
          <Menu.Item onPress={() => { setSettingsVisible(false); navigation.navigate('About'); }} title="О приложении" />
          <Menu.Item onPress={() => { setSettingsVisible(false); navigation.navigate('Settings'); }} title="Расширенные настройки" />
        </Menu>
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
              onLongPress={() => navigation.navigate('TaskForm', { task: item })}
              onToggle={() => handleTogglePin(item.id)}
            />
          )}
          ItemSeparatorComponent={Divider}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      )}

      {/* Кнопка добавления задачи */}
      <FAB
        style={[styles.fab, { backgroundColor: paperTheme.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('TaskForm')}
      />
      <Snackbar
        visible={!!snackbar}
        onDismiss={() => setSnackbar('')}
        duration={1500}
      >
        {snackbar}
      </Snackbar>
    </View>
  );
}
