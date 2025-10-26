import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAppTheme } from '../../providers/ThemeProvider';

export interface HeaderBarProps {
  title: string;
  showBack?: boolean;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  showThemeToggle?: boolean;
}

export function HeaderBar({ 
  title, 
  showBack = true, 
  rightAction,
  showThemeToggle = true 
}: HeaderBarProps) {
  const navigation = useNavigation();
  const { theme } = useAppTheme();

  return (
    <Appbar.Header
      style={[
        styles.header,
        { backgroundColor: theme.colors.surface }
      ]}
    >
      {showBack && (
        <Appbar.BackAction 
          onPress={() => navigation.goBack()} 
        />
      )}
      <Appbar.Content 
        title={title}
        titleStyle={{ color: theme.colors.onSurface }}
      />
      {showThemeToggle && <ThemeToggle />}
      {rightAction && (
        <Appbar.Action 
          icon={rightAction.icon} 
          onPress={rightAction.onPress}
        />
      )}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    elevation: 4,
  },
});