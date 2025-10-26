import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useAppTheme } from '../../providers/ThemeProvider';

export const ThemeToggle: React.FC = () => {
  const { themeMode, setTheme, isDark } = useAppTheme();

  const handleThemeChange = () => {
    // 在 light, dark, system 之間循環切換
    const modes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(themeMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setTheme(nextMode);
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return 'white-balance-sunny';
      case 'dark':
        return 'moon-waning-crescent';
      case 'system':
        return 'theme-light-dark';
      default:
        return 'theme-light-dark';
    }
  };

  const getThemeLabel = () => {
    switch (themeMode) {
      case 'light':
        return '淺色模式';
      case 'dark':
        return '深色模式';
      case 'system':
        return '系統模式';
      default:
        return '主題';
    }
  };

  return (
    <View style={styles.container}>
      <IconButton
        icon={getThemeIcon()}
        onPress={handleThemeChange}
        mode="outlined"
        selected={isDark}
      />
      <Text variant="bodySmall" style={styles.label}>
        {getThemeLabel()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 4,
  },
});