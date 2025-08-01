import React, { useState, useEffect } from 'react';
import { View, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput, Button, Snackbar, Dialog, Portal, RadioButton, Switch, Text } from 'react-native-paper';
import { useTasks } from '../context/TaskContext';
import { scheduleTaskNotification, cancelTaskNotification } from '../services/notificationService';
import { TASK_STATUSES } from '../constants';

export default function TaskFormScreen({ navigation, route }) {
  const { addTask, updateTask } = useTasks();
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
      status: editingTask ? editingTask.status : TASK_STATUSES[0],
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

  const onDateChange = (_, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const onTimeChange = (_, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const iso = selectedTime.toISOString();
      setTime(iso.split('T')[1].slice(0, 5));
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput label="Заголовок" value={title} onChangeText={setTitle} style={{ marginBottom: 8 }} />
      <TextInput label="Описание" value={description} onChangeText={setDescription} style={{ marginBottom: 8 }} />
      <TextInput
        label="Дата"
        value={date}
        showSoftInputOnFocus={false}
        onPressIn={() => setShowDatePicker(true)}
        style={{ marginBottom: 8 }}
      />
      {showDatePicker && (
        <DateTimePicker
          value={date ? new Date(`${date}T00:00:00`) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}

      <TextInput
        label="Время"
        value={time}
        showSoftInputOnFocus={false}
        onPressIn={() => setShowTimePicker(true)}
        style={{ marginBottom: 8 }}
      />
      {showTimePicker && (
        <DateTimePicker
          value={time ? new Date(`1970-01-01T${time}:00`) : new Date()}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onTimeChange}
        />
      )}
      <TextInput label="Адрес" value={address} onChangeText={setAddress} style={{ marginBottom: 8 }} />
      <RadioButton.Group onValueChange={setCategory} value={category}>
        <RadioButton.Item label="Работа" value="Работа" />
        <RadioButton.Item label="Учёба" value="Учёба" />
        <RadioButton.Item label="Личное" value="Личное" />
      </RadioButton.Group>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
        <Switch value={pinned} onValueChange={setPinned} />
        <Text style={{ marginLeft: 8 }}>Закрепить</Text>
      </View>

      <Button mode="contained" onPress={handleSave}>
        {editingTask ? 'Обновить' : 'Сохранить'}
      </Button>

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
                label="Интервал (дней)"
                keyboardType="number-pad"
                value={customDays}
                onChangeText={setCustomDays}
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
