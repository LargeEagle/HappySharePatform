import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export interface ButtonProps {
  onPress: () => void;
  mode?: 'text' | 'outlined' | 'contained';
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  color?: string;
  style?: object;
}

export function Button({
  onPress,
  mode = 'contained',
  children,
  loading = false,
  disabled = false,
  color,
  style,
}: ButtonProps) {
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      style={[styles.button, style]}
      textColor={color}
    >
      {children}
    </PaperButton>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
});