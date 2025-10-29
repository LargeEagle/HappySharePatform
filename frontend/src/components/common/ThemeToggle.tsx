import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useAppTheme } from '../../providers/ThemeProvider';

interface ThemeToggleProps {
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabel = false }) => {
  const { themeMode, setTheme, isDark } = useAppTheme();

  const handleThemeChange = () => {
    // 切換 light 和 dark 模式
    setTheme(isDark ? 'light' : 'dark');
  };

  const getThemeIcon = () => {
    return isDark ? 'weather-night' : 'weather-sunny';
  };

  const getThemeLabel = () => {
    return isDark ? '深色模式' : '淺色模式';
  };

  return (
    <View style={styles.container}>
      <IconButton
        icon={getThemeIcon()}
        onPress={handleThemeChange}
        size={24}
        iconColor={isDark ? '#FFD700' : '#FFA500'}
      />
      {showLabel && (
        <Text variant="bodySmall" style={styles.label}>
          {getThemeLabel()}
        </Text>
      )}
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