import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

export interface SafeAreaLayoutProps {
  children: React.ReactNode;
  style?: object;
}

export function SafeAreaLayout({ children, style }: SafeAreaLayoutProps) {
  return (
    <SafeAreaView style={[styles.container, style]} edges={['top', 'bottom']}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});