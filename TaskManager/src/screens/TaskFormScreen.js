import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { TextInput, Button, Snackbar, Dialog, Portal, RadioButton, Text, Menu } from 'react-native-paper';
import IOSSwitch from '../components/IOSSwitch';
import PrimaryButton from '../components/PrimaryButton';
import SegmentedControl from '../components/SegmentedControl';
import IOSDatePicker from '../components/IOSDatePicker';
import styles from '../styles/styles';
import { useThemePreferences } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';
import { scheduleTaskNotification, cancelTaskNotification } from '../services/notificationService';
import { TASK_STATUSES } from '../constants';

const categoryIcon = (category) => {
  switch (category) {
    case 'Работа':
      return 'briefcase';
    case 'Учёба':
      return 'school';
    default:
      return 'account';
  }
};

export default function TaskFormScreen({ navigation, route }) {
  const { addTask, updateTask } = useTasks();
  const { paperTheme } = useThemePreferences();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [reminderTime, setReminderTime] = useState('10');
  const [repeat, setRepeat] = useState('none'); // none | daily | weekly | custom
  const [customDays, setCustomDays] = useState('1');
  const [pinned, setPinned] = useState(false);
  const [category, setCategory] = useState('Работа');
  const [status, setStatus] = useState(TASK_STATUSES[0]);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [descHeight, setDescHeight] = useState(80);
  const [tempDate, setTempDate] = useState(new Date());
  const [tempTime, setTempTime] = useState(new Date());
  const editingTask = route.params?.task;

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      const dateObj = new Date(editingTask.date);
      setDate(dateObj.toISOString().split('T')[0]);
      setTime(dateObj.toISOString().split('T')[1].slice(0,5));
      setAddress(editingTask.address);
      setReminderTime(editingTask.reminder || '10');
      setRepeat(editingTask.repeat || 'none');
      setCustomDays(editingTask.customDays ? String(editingTask.customDays) : '1');
      setCategory(editingTask.category || 'Работа');
      setPinned(editingTask.pinned || false);
      setStatus(editingTask.status || TASK_STATUSES[0]);
      setTempDate(new Date(editingTask.date));
      setTempTime(new Date(editingTask.date));
    }
  }, [editingTask]);


  const handleSave = () => {
    if (!title.trim()) {
      alert('Введите заголовок задачи');
      return;
    }
    if (!date || !time) {
      alert('Выберите дату и время');
      return;
    }

    const taskDateTime = new Date(`${date}T${time}:00`);
    if (isNaN(taskDateTime.getTime()) || taskDateTime < new Date()) {
      alert('Дата и время некорректны');
      return;
    }

    setDialogVisible(true);
  };

  const confirmSave = async () => {
    const taskDateTime = new Date(`${date}T${time}:00`);
    const newTask = {
      id: editingTask ? editingTask.id : Date.now().toString(),
      title,
      description,
      date: taskDateTime.toISOString(),
      address,
      status,
      reminder: reminderTime,
      repeat,
      customDays: repeat === 'custom' ? parseInt(customDays, 10) : undefined,
      category,
      pinned,
      notificationId: editingTask ? editingTask.notificationId : undefined,
    };

    if (editingTask && editingTask.notificationId) {
      await cancelTaskNotification(editingTask.notificationId);
    }

    const id = await scheduleTaskNotification(newTask);
    if (id) {
      newTask.notificationId = id;
    }

    if (editingTask) {
      await updateTask(newTask);
    } else {
      await addTask(newTask);
    }

    setDialogVisible(false);
    setSnackbarVisible(true);

    setTimeout(() => navigation.goBack(), 1000);
  };


  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: paperTheme.colors.background }}>
      <TextInput
        mode="outlined"
        autoFocus
        autoComplete="off"
        label="Заголовок"
        value={title}
        onChangeText={setTitle}
        outlineColor="#B0B0B0"
        activeOutlineColor="#4A90E2"
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Описание"
        placeholder="Добавьте детали задачи…"
        value={description}
        onChangeText={setDescription}
        multiline
        onContentSizeChange={(e) => setDescHeight(e.nativeEvent.contentSize.height)}
        outlineColor="#B0B0B0"
        activeOutlineColor="#4A90E2"
        style={[styles.input, { height: Math.max(80, descHeight) }]}
      />
      {description ? <Markdown style={{ marginBottom: 8 }}>{description}</Markdown> : null}
      <TextInput
        mode="outlined"
        label="Дата"
        value={date}
        showSoftInputOnFocus={false}
        onPressIn={() => {
          setTempDate(date ? new Date(`${date}T00:00:00`) : new Date());
          setShowDatePicker(true);
        }}
        outlineColor="#B0B0B0"
        activeOutlineColor="#4A90E2"
        style={styles.input}
      />
      <IOSDatePicker
        open={showDatePicker}
        date={tempDate}
        mode="date"
        dark={paperTheme.dark}
        onConfirm={(d) => {
          setShowDatePicker(false);
          setTempDate(d);
          setDate(d.toISOString().split('T')[0]);
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      <TextInput
        mode="outlined"
        label="Время"
        value={time}
        showSoftInputOnFocus={false}
        onPressIn={() => {
          setTempTime(time ? new Date(`1970-01-01T${time}:00`) : new Date());
          setShowTimePicker(true);
        }}
        outlineColor="#B0B0B0"
        activeOutlineColor="#4A90E2"
        style={styles.input}
      />
      <IOSDatePicker
        open={showTimePicker}
        date={tempTime}
        mode="time"
        dark={paperTheme.dark}
        onConfirm={(t) => {
          setShowTimePicker(false);
          setTempTime(t);
          const iso = t.toISOString();
          setTime(iso.split('T')[1].slice(0, 5));
        }}
        onCancel={() => setShowTimePicker(false)}
      />
      <TextInput
        mode="outlined"
        label="Адрес"
        value={address}
        onChangeText={setAddress}
        outlineColor="#B0B0B0"
        activeOutlineColor="#4A90E2"
        style={styles.input}
      />
      <Menu
        visible={categoryMenuVisible}
        onDismiss={() => setCategoryMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            icon={categoryIcon(category)}
            onPress={() => setCategoryMenuVisible(true)}
            style={styles.input}
          >
            {category}
          </Button>
        }
      >
        {['Работа', 'Учёба', 'Личное'].map((c) => (
          <Menu.Item
            key={c}
            onPress={() => {
              setCategory(c);
              setCategoryMenuVisible(false);
            }}
            title={c}
            leadingIcon={categoryIcon(c)}
          />
        ))}
      </Menu>

      <SegmentedControl
        value={status}
        onValueChange={setStatus}
        style={{ marginBottom: 12 }}
        buttons={TASK_STATUSES.map((s) => ({ value: s, label: s }))}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
        <IOSSwitch value={pinned} onValueChange={setPinned} />
        <Text style={{ marginLeft: 8 }}>Закрепить</Text>
      </View>

      <PrimaryButton onPress={handleSave}>
        {editingTask ? 'Обновить' : 'Сохранить'}
      </PrimaryButton>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Напоминание</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group onValueChange={setReminderTime} value={reminderTime}>
              <RadioButton.Item label="За 10 минут" value="10" />
              <RadioButton.Item label="За 30 минут" value="30" />
              <RadioButton.Item label="За 1 час" value="60" />
            </RadioButton.Group>

            <RadioButton.Group onValueChange={setRepeat} value={repeat}>
              <RadioButton.Item label="Не повторять" value="none" />
              <RadioButton.Item label="Каждый день" value="daily" />
              <RadioButton.Item label="Каждую неделю" value="weekly" />
              <RadioButton.Item label="Кастом" value="custom" />
            </RadioButton.Group>
            {repeat === 'custom' && (
              <TextInput
                mode="outlined"
                label="Интервал (дней)"
                keyboardType="number-pad"
                value={customDays}
                onChangeText={setCustomDays}
                outlineColor="#B0B0B0"
                activeOutlineColor="#4A90E2"
                style={{ marginTop: 8 }}
              />
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={confirmSave}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={1500}
      >
        {editingTask ? 'Задача обновлена!' : 'Задача сохранена!'}
      </Snackbar>
    </View>
  );
}
