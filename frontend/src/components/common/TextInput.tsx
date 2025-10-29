import React from 'react';
import { TextInput as PaperTextInput, HelperText } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

export interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: boolean;
  errorText?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  style?: object;
}

export function TextInput({
  value,
  onChangeText,
  label,
  placeholder,
  secureTextEntry = false,
  error = false,
  errorText,
  autoCapitalize = 'none',
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  style,
}: TextInputProps) {
  return (
    <View style={styles.container}>
      <PaperTextInput
        mode="outlined"
        value={value}
        onChangeText={onChangeText}
        label={label}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        error={error}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        disabled={disabled}
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