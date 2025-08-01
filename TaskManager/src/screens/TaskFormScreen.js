import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Snackbar, Dialog, Portal, RadioButton } from 'react-native-paper';
import { saveTask } from '../services/storageService';
import { scheduleTaskNotification } from '../services/notificationService';

export default function TaskFormScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [reminderTime, setReminderTime] = useState('10');
  const [repeat, setRepeat] = useState('none'); // none | daily | weekly

  const isValidDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
  const isValidTime = (value) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

  const handleSave = () => {
    if (!title.trim()) {
      alert('Введите заголовок задачи');
      return;
    }
    if (!isValidDate(date)) {
      alert('Введите дату в формате YYYY-MM-DD');
      return;
    }
    if (!isValidTime(time)) {
      alert('Введите время в формате HH:mm');
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
      id: Date.now().toString(),
      title,
      description,
      date: taskDateTime.toISOString(),
      address,
      status: 'В процессе',
      reminder: reminderTime,
      repeat, // новое поле
    };

    await saveTask(newTask);
    await scheduleTaskNotification(newTask);

    setDialogVisible(false);
    setSnackbarVisible(true);

    setTimeout(() => navigation.goBack(), 1000);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput label="Заголовок" value={title} onChangeText={setTitle} style={{ marginBottom: 8 }} />
      <TextInput label="Описание" value={description} onChangeText={setDescription} style={{ marginBottom: 8 }} />
      <TextInput label="Дата (YYYY-MM-DD)" value={date} onChangeText={setDate} style={{ marginBottom: 8 }} />
      <TextInput label="Время (HH:mm)" value={time} onChangeText={setTime} style={{ marginBottom: 8 }} />
      <TextInput label="Адрес" value={address} onChangeText={setAddress} style={{ marginBottom: 8 }} />

      <Button mode="contained" onPress={handleSave}>Сохранить</Button>

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
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={confirmSave}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={1500}>
        Задача сохранена!
      </Snackbar>
    </View>
  );
}
