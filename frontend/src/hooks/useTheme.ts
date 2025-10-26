import { useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, AppTheme } from '../config/theme.config';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: AppTheme;
  isDark: boolean;
  themeMode: ThemeMode;
  setTheme: (mode: ThemeMode) => Promise<void>;
  isLoading: boolean;
}

export function useTheme(): ThemeContextValue {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isLoading, setIsLoading] = useState(true);

  const isDark = useMemo(() => {
    return themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');
  }, [themeMode, systemColorScheme]);

  const theme = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);

  const setTheme = useCallback(async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem('@theme_mode', mode);
      setThemeMode(mode);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }, []);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@theme_mode');
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme as ThemeMode)) {
          setThemeMode(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  return {
    theme,
    isDark,
    themeMode,
    setTheme,
    isLoading
  };
}