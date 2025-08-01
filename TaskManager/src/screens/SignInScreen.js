import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { signInWithGoogle } from '../services/authService';

export default function SignInScreen({ onSignIn }) {
  const handleSignIn = async () => {
    const user = await signInWithGoogle();
    if (user) {
      onSignIn(user);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button mode="contained" onPress={handleSignIn}>
        Войти через Google
      </Button>
    </View>
  );
}
