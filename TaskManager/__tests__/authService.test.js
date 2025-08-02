const { signInWithGoogle } = require('../src/services/authService');

describe('authService', () => {
  test('signInWithGoogle returns default user object', async () => {
    const user = await signInWithGoogle();
    expect(user).toHaveProperty('name', 'User');
    expect(typeof user.id).toBe('string');
  });
});
