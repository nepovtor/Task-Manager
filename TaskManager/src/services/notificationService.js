import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Не удалось получить разрешение на отправку уведомлений.');
      return;
    }
  } else {
    alert('Push-уведомления доступны только на реальных устройствах.');
  }
}

export async function scheduleTaskNotification(task) {
  try {
    const reminderMinutes = parseInt(task.reminder, 10);
    const taskTime = new Date(task.date);
    const notificationTime = new Date(taskTime.getTime() - reminderMinutes * 60000);

    if (isNaN(notificationTime.getTime()) || notificationTime <= new Date()) {
      console.warn('Некорректное время для уведомления, уведомление не будет создано');
      return null;
    }

    let trigger;
    if (task.repeat && task.repeat !== 'none') {
      if (task.repeat === 'custom') {
        const days = task.customDays || 1;
        trigger = { seconds: 86400 * days, repeats: true };
      } else {
        trigger = {
          hour: notificationTime.getHours(),
          minute: notificationTime.getMinutes(),
          repeats: true,
          weekday: task.repeat === 'weekly' ? notificationTime.getDay() : undefined,
        };
      }
    } else {
      trigger = notificationTime;
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Напоминание о задаче',
        body: `${task.title} (${task.status})`,
      },
      trigger,
    });

    return id;
  } catch (e) {
    console.error('Ошибка планирования уведомления', e);
    return null;
  }
}

export async function cancelTaskNotification(id) {
  try {
    if (id) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
  } catch (e) {
    console.error('Ошибка отмены уведомления', e);
  }
}
