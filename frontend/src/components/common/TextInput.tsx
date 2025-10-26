import React from 'react';
import { TextInput as PaperTextInput, HelperText } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

export interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label: string;
  secureTextEntry?: boolean;
  error?: boolean;
  errorText?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  style?: object;
}

export function TextInput({
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  error = false,
  errorText,
  autoCapitalize = 'none',
  keyboardType = 'default',
  style,
}: TextInputProps) {
  return (
    <View style={styles.container}>
      <PaperTextInput
        mode="outlined"
        value={value}
        onChangeText={onChangeText}
        label={label}
        secureTextEntry={secureTextEntry}
        error={error}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        style={[styles.input, style]}
      />
      {error && errorText && (
        <HelperText type="error" visible={error}>
          {errorText}
        </HelperText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  input: {
    width: '100%',
  },
});