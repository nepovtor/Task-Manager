jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('../src/services/supabaseService', () => ({
  syncTasks: jest.fn(),
}));

jest.mock('../src/services/notificationService', () => ({
  cancelTaskNotification: jest.fn(),
}));

const AsyncStorage = require('@react-native-async-storage/async-storage');
const { getTasks, saveTask, deleteTask } = require('../src/services/storageService');

describe('storageService', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockReset();
    AsyncStorage.setItem.mockReset();
  });

  test('getTasks returns parsed tasks', async () => {
    const tasks = [{ id: '1', title: 't', priority: 'Высокий' }];
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(tasks));
    const res = await getTasks();
    expect(res[0].priority).toBe('Высокий');
  });

  test('saveTask stores new task', async () => {
    AsyncStorage.getItem.mockResolvedValue('[]');
    await saveTask({ id: '1', subtasks: [{ id: 's1', title: 'st', done: false }] });
    const saved = JSON.parse(AsyncStorage.setItem.mock.calls[0][1]);
    expect(saved[0].subtasks[0].title).toBe('st');
  });

  test('deleteTask removes task', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([{ id: '1' }]));
    await deleteTask('1');
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
