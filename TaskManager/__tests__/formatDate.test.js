process.env.TZ = 'UTC';
const formatDate = require('../src/utils/formatDate').default;

describe('formatDate', () => {
  test('formats ISO string into human readable Russian date', () => {
    const result = formatDate('2023-05-15T14:30:00.000Z');
    expect(result).toBe('15 мая 2023');
  });

  test('returns Сегодня for today', () => {
    const today = new Date().toISOString();
    expect(formatDate(today)).toBe('Сегодня');
  });

  test('returns Завтра for tomorrow', () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    expect(formatDate(tomorrow)).toBe('Завтра');
  });

  test('returns Вчера for yesterday', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    expect(formatDate(yesterday)).toBe('Вчера');
  });
});
