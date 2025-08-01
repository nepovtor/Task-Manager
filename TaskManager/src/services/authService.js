export const signInWithGoogle = async () => {
  // Placeholder auth implementation
  try {
    return { name: 'User', id: Date.now().toString() };
  } catch (e) {
    console.error('Auth error', e);
    return null;
  }
};
