import React, { createContext, useContext, ReactNode } from 'react';
import { useTheme as useThemeHook } from '../hooks/useTheme';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppTheme } from '../config/theme.config';

interface ThemeContextType {
  theme: AppTheme;
  isDark: boolean;
  themeMode: 'light' | 'dark' | 'system';
  setTheme: (mode: 'light' | 'dark' | 'system') => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const themeHook = useThemeHook();

  return (
    <ThemeContext.Provider value={themeHook}>
      <PaperProvider theme={themeHook.theme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};