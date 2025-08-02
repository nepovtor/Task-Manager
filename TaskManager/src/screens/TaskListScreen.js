import React, { useEffect, useRef, useState } from 'react';
import { View, SectionList, Animated, LayoutAnimation } from 'react-native';
import {
  FAB,
  Appbar,
  Menu,
  Searchbar,
  Text,
  Button,
  Divider,
  Snackbar,
} from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { useTasks } from '../context/TaskContext';
import { useThemePreferences } from '../context/ThemeContext';
import i18n from '../i18n';
import { TASK_STATUSES } from '../constants';
import TaskItem from '../components/TaskItem';
import TaskWidget from '../components/TaskWidget';
import styles from '../styles/styles';
import formatDate from '../utils/formatDate';

export default function TaskListScreen({ navigation }) {
  const { tasks: storedTasks, togglePin } = useTasks();
  const { theme, toggleTheme, paperTheme } = useThemePreferences();
  const [tasks, setTasks] = useState([]);
  const [sections, setSections] = useState([]);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const [snackbar, setSnackbar] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [sortType, setSortType] = useState('date'); // date | status
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState(i18n.locale);
  const [menuStage, setMenuStage] = useState('main'); // main | display | tasks | months | system
  const [dayOffset, setDayOffset] = useState(0);
  const [dayTitle, setDayTitle] = useState('Сегодня');
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
  }, [isFocused, filterStatus, searchQuery, storedTasks, sortType, dayOffset]);

  const updateList = () => {
    let list = storedTasks || [];
    if (filterStatus !== 'all') {
      list = list.filter((t) => t.status === filterStatus);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q));
    }
    const sorted = sortTasks(list, sortType);
    const { filtered, title } = groupByDate(sorted, dayOffset);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(filtered);
    setDayTitle(title);
    setSections(filtered.length ? [{ title, data: filtered }] : []);
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
    const sorted = sortTasks(tasks, type);
    const { filtered, title } = groupByDate(sorted, dayOffset);
    setTasks(filtered);
    setDayTitle(title);
    setSections(filtered.length ? [{ title, data: filtered }] : []);
    setSettingsVisible(false);
    setMenuStage('main');
  };

  const changeFilter = (status) => {
    setFilterStatus(status);
    setSettingsVisible(false);
    setMenuStage('main');
  };

  const handleTogglePin = async (id) => {
    const updated = await togglePin(id);
    if (updated) {
      const updatedTasks = sortTasks(
        tasks.map((t) => (t.id === id ? updated : t)),
        sortType,
      );
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const { filtered, title } = groupByDate(updatedTasks, dayOffset);
      setTasks(filtered);
      setDayTitle(title);
      setSections(filtered.length ? [{ title, data: filtered }] : []);
    }
  };

  const groupByDate = (arr, offset) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(today);
    target.setDate(today.getDate() + offset);
    const filtered = arr.filter((task) => {
      const d = new Date(task.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === target.getTime();
    });
    let title;
    if (offset === 0) title = 'Сегодня';
    else if (offset === 1) title = 'Завтра';
    else if (offset === -1) title = 'Вчера';
    else title = formatDate(target.toISOString());
    return { filtered, title };
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
        <Appbar.Action icon="chevron-left" onPress={() => setDayOffset((o) => o - 1)} />
        <Appbar.Content title={dayTitle} />
        <Appbar.Action icon="chevron-right" onPress={() => setDayOffset((o) => o + 1)} />
        <Menu
          visible={settingsVisible}
          onDismiss={() => {
            setSettingsVisible(false);
            setMenuStage('main');
          }}
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
          {menuStage === 'main' && (
            <>
              <Menu.Item onPress={() => setMenuStage('display')} title="Отображение" />
              <Menu.Item onPress={() => setMenuStage('tasks')} title="Управление задачами" />
              <Menu.Item onPress={() => setMenuStage('months')} title="По месяцам" />
              <Menu.Item onPress={() => setMenuStage('system')} title="Система" />
            </>
          )}
          {menuStage === 'display' && (
            <>
              <Menu.Item onPress={() => setMenuStage('main')} title="Назад" />
              <Divider />
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
            </>
          )}
          {menuStage === 'tasks' && (
            <>
              <Menu.Item onPress={() => setMenuStage('main')} title="Назад" />
              <Divider />
              <Menu.Item onPress={() => changeFilter('all')} title="Все" />
              <Menu.Item onPress={() => changeFilter(TASK_STATUSES[0])} title="Активные" />
              <Menu.Item onPress={() => changeFilter(TASK_STATUSES[1])} title="Завершённые" />
              <Menu.Item onPress={() => changeFilter(TASK_STATUSES[2])} title="Отменённые" />
            </>
          )}
          {menuStage === 'months' && (
            <>
              <Menu.Item onPress={() => setMenuStage('main')} title="Назад" />
              <Divider />
              <Menu.Item
                onPress={() => {
                  setSettingsVisible(false);
                  setMenuStage('main');
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
                  setMenuStage('main');
                  navigation.navigate('MonthTasks', {
                    monthOffset: 0,
                    title: 'Календарь',
                  });
                }}
                title="Календарь"
              />
            </>
          )}
          {menuStage === 'system' && (
            <>
              <Menu.Item onPress={() => setMenuStage('main')} title="Назад" />
              <Divider />
              <Menu.Item
                onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                title={notificationsEnabled ? 'Отключить уведомления' : 'Включить уведомления'}
              />
              <Menu.Item
                onPress={() => {
                  setSettingsVisible(false);
                  setMenuStage('main');
                  navigation.navigate('About');
                }}
                title="О приложении"
              />
              <Menu.Item
                onPress={() => {
                  setSettingsVisible(false);
                  setMenuStage('main');
                  navigation.navigate('Settings');
                }}
                title="Расширенные настройки"
              />
            </>
          )}
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
      {sections.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>{i18n.t('noTasks')}</Text>
          <Button mode="contained" onPress={() => navigation.navigate('TaskForm')} style={{ marginTop: 16 }}>
            {i18n.t('createTask')}
          </Button>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onPress={() => navigation.navigate('TaskDetail', { task: item })}
              onLongPress={() => navigation.navigate('TaskForm', { task: item })}
              onToggle={() => handleTogglePin(item.id)}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{title}</Text>
            </View>
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
        size="small"
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
