process.env.TZ = 'UTC';
const formatDate = require('../src/utils/formatDate').default;

describe('formatDate', () => {
  test('formats ISO string into human readable Russian date', () => {
    const result = formatDate('2023-05-15T14:30:00.000Z');
    expect(result).toBe('15 мая 2023, 14:30');
  });
});
