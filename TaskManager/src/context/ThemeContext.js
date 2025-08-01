import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

const systemFont = Platform.select({ ios: 'System', android: 'sans-serif' });
const baseFonts = {};
const DEFAULT_ACCENT = Platform.select({ ios: '#007AFF', android: '#6200EE', default: '#1F2937' });
Object.keys(MD3LightTheme.fonts).forEach((k) => {
  baseFonts[k] = { ...MD3LightTheme.fonts[k], fontFamily: systemFont };
});

const createThemes = (accent) => ({
  light: {
    ...MD3LightTheme,
    fonts: baseFonts,
    colors: {
      ...MD3LightTheme.colors,
      primary: accent,
      secondary: accent,
      background: '#FFFFFF',
      surface: '#F5F5F5',
      onBackground: '#000000',
      onSurface: '#000000',
    },
  },
  dark: {
    ...MD3DarkTheme,
    fonts: baseFonts,
    colors: {
      ...MD3DarkTheme.colors,
      primary: accent,
      secondary: accent,
      background: '#000000',
      surface: '#121212',
      onBackground: '#FFFFFF',
      onSurface: '#FFFFFF',
    },
  },
});

const STORAGE_KEY = 'APP_THEME';
const COLOR_KEY = 'ACCENT_COLOR';

const ThemeContext = createContext({
  theme: 'light',
  paperTheme: createThemes(DEFAULT_ACCENT).light,
  toggleTheme: () => {},
  accentColor: DEFAULT_ACCENT,
  setAccentColor: () => {},
});

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState(systemScheme || 'light');
  const [accentColor, setAccentColorState] = useState(DEFAULT_ACCENT);

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
