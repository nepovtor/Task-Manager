import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useThemePreferences } from '../context/ThemeContext';
import { signInWithGoogle } from '../services/authService';

export default function SignInScreen({ onSignIn }) {
  const { paperTheme } = useThemePreferences();
  const handleSignIn = async () => {
    const user = await signInWithGoogle();
    if (user) {
      onSignIn(user);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: paperTheme.colors.background }}>
      <Button mode="contained" onPress={handleSignIn}>
        Войти через Google
      </Button>
    </View>
  );
}
