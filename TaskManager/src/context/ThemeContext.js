import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

const createThemes = (accent) => ({
  light: {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: accent,
      secondary: '#9A82DB',
      background: '#F4F4F7',
      surface: '#FFFFFF',
      onBackground: '#1C1B1F',
      onSurface: '#1C1B1F',
    },
  },
  dark: {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: accent,
      secondary: '#CCC2DC',
      background: '#1C1B1F',
      surface: '#2B2A2E',
      onBackground: '#E6E1E5',
      onSurface: '#E6E1E5',
    },
  },
});

const STORAGE_KEY = 'APP_THEME';
const COLOR_KEY = 'ACCENT_COLOR';

const ThemeContext = createContext({
  theme: 'light',
  paperTheme: createThemes('#6750A4').light,
  toggleTheme: () => {},
  accentColor: '#6750A4',
  setAccentColor: () => {},
});

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState(systemScheme || 'light');
  const [accentColor, setAccentColorState] = useState('#6750A4');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value === 'light' || value === 'dark') {
        setTheme(value);
      }
    });
    AsyncStorage.getItem(COLOR_KEY).then((c) => {
      if (c) setAccentColorState(c);
    });
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem(STORAGE_KEY, newTheme);
  };

  const setAccentColor = async (color) => {
    setAccentColorState(color);
    await AsyncStorage.setItem(COLOR_KEY, color);
  };

  const themes = createThemes(accentColor);
  const paperTheme = theme === 'light' ? themes.light : themes.dark;

  return (
    <ThemeContext.Provider value={{ theme, paperTheme, toggleTheme, accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemePreferences = () => useContext(ThemeContext);
