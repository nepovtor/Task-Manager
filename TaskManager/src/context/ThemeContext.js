import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6750A4',
    secondary: '#9A82DB',
    background: '#F4F4F7',
    surface: '#FFFFFF',
    onBackground: '#1C1B1F',
    onSurface: '#1C1B1F',
  },
};

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#D0BCFF',
    secondary: '#CCC2DC',
    background: '#1C1B1F',
    surface: '#2B2A2E',
    onBackground: '#E6E1E5',
    onSurface: '#E6E1E5',
  },
};

const STORAGE_KEY = 'APP_THEME';

const ThemeContext = createContext({
  theme: 'light',
  paperTheme: customLightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState(systemScheme || 'light');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value === 'light' || value === 'dark') {
        setTheme(value);
      }
    });
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem(STORAGE_KEY, newTheme);
  };

  const paperTheme = theme === 'light' ? customLightTheme : customDarkTheme;

  return (
    <ThemeContext.Provider value={{ theme, paperTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemePreferences = () => useContext(ThemeContext);
