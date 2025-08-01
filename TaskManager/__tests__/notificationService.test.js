jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn().mockResolvedValue('id'),
  cancelScheduledNotificationAsync: jest.fn(),
}));
jest.mock('expo-device', () => ({}));
jest.mock('react-native', () => ({ Platform: { OS: 'ios' } }));

const Notifications = require('expo-notifications');
const { scheduleTaskNotification, cancelTaskNotification } = require('../src/services/notificationService');

describe('notificationService', () => {
  test('scheduleTaskNotification schedules notification', async () => {
    const task = { title: 't', date: new Date(Date.now() + 11 * 60000).toISOString(), reminder: '10' };
    const id = await scheduleTaskNotification(task);
    expect(id).toBe('id');
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
  });

  test('cancelTaskNotification cancels by id', async () => {
    await cancelTaskNotification('id');
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith('id');
  });
});
