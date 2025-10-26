import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { useAppTheme } from '../../providers/ThemeProvider';

export interface SafeAreaLayoutProps {
  children: React.ReactNode;
  style?: object;
}

export function SafeAreaLayout({ children, style }: SafeAreaLayoutProps) {
  const { theme } = useAppTheme();
  
  return (
    <SafeAreaView 
      style={[
        styles.container, 
        { backgroundColor: theme.colors.background },
        style
      ]} 
      edges={['top', 'bottom']}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});