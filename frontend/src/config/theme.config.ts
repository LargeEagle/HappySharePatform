import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';

export interface AppTheme extends MD3Theme {
  custom: {
    backdrop: string;
  };
}

// 自定義淺色主題
export const lightTheme: AppTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#007AFF',
    primaryContainer: '#B8E1FF',
    secondary: '#5856D6',
    secondaryContainer: '#DBD9FF',
    tertiary: '#2AC9A1',
    tertiaryContainer: '#B3F2E2',
    surface: '#FFFFFF',
    surfaceVariant: '#F2F2F7',
    background: '#F2F2F7',
    error: '#FF3B30',
    errorContainer: '#FFD9D9',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#003166',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#1D1B59',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#0A4D3D',
    onSurface: '#000000',
    onSurfaceVariant: '#666666',
    onError: '#FFFFFF',
    onErrorContainer: '#660C0C',
    outline: '#CCCCCC',
    outlineVariant: '#E5E5EA',
    scrim: 'rgba(0, 0, 0, 0.3)',
  },
  custom: {
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
};

// 自定義深色主題
export const darkTheme: AppTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#0A84FF',
    primaryContainer: '#004C99',
    secondary: '#5E5CE6',
    secondaryContainer: '#2E2B8C',
    tertiary: '#2AC9A1',
    tertiaryContainer: '#0A4D3D',
    surface: '#1C1C1E',
    surfaceVariant: '#2C2C2E',
    background: '#000000',
    error: '#FF453A',
    errorContainer: '#660C0C',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#CCE4FF',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#DBD9FF',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#B3F2E2',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#999999',
    onError: '#FFFFFF',
    onErrorContainer: '#FFD9D9',
    outline: '#666666',
    outlineVariant: '#3A3A3C',
    scrim: 'rgba(0, 0, 0, 0.6)',
  },
  custom: {
    backdrop: 'rgba(0, 0, 0, 0.8)',
  },
};