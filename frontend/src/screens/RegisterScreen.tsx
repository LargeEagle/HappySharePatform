import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaLayout } from '../components/layout';
import { Button, TextInput, Card } from '../components/common';
import { useAuth } from '../hooks/useAuth';
import { useDocumentationCheck } from '../hooks/useDocumentationCheck';
import { RootStackParamList } from '../types/navigation';
import { updateDevDocs } from '../utils/devDocs';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading, error } = useAuth();
  const { addChange } = useDocumentationCheck();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      // Track password mismatch in documentation
      addChange({
        component: 'RegisterScreen',
        changeType: 'updated',
        description: `Registration failed - Password mismatch at ${new Date().toISOString()}`
      });
      return;
    }

    // Track registration attempt in documentation
    addChange({
      component: 'RegisterScreen',
      changeType: 'created',
      description: `Registration attempt for user ${username} (${email}) at ${new Date().toISOString()}`
    });

    try {
      await register({ username, email, password, confirmPassword });
      
      if (!error) {
        // Track successful registration in documentation
        addChange({
          component: 'RegisterScreen',
          changeType: 'updated',
          description: `Registration successful for user ${username} (${email}) at ${new Date().toISOString()}`
        });
        navigation.navigate('Login');
      }
    } catch (err) {
      // Track registration failure in documentation
      addChange({
        component: 'RegisterScreen',
        changeType: 'updated',
        description: `Registration failed for user ${username} (${email}): ${err instanceof Error ? err.message : String(err)} at ${new Date().toISOString()}`
      });
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaLayout>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Text variant="headlineMedium" style={styles.title}>
            Create Account
          </Text>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            error={!!error}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!error}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={!!error}
          />
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={!!error}
            errorText={error || undefined}
          />
          <Button
            onPress={handleRegister}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          >
            Create Account
          </Button>
          <Button
            onPress={handleLogin}
            mode="outlined"
            disabled={isLoading}
            style={styles.button}
          >
            Already have an account? Login
          </Button>
        </Card>
      </View>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    marginTop: 8,
  },
});