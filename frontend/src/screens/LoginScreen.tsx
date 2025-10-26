import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaLayout } from '../components/layout';
import { Button, TextInput, Card, TestLogin, ThemeToggle } from '../components/common';
import { useAuth } from '../hooks/useAuth';
import { useDocumentationCheck } from '../hooks/useDocumentationCheck';
import { useTheme } from '../providers/ThemeProvider';
import { RootStackParamList } from '../types/navigation';
import { updateDevDocs } from '../utils/devDocs';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const { addChange } = useDocumentationCheck();

  const handleLogin = async () => {
    try {
      // 記錄功能使用
      addChange({
        component: 'LoginScreen',
        changeType: 'updated',
        description: '用戶嘗試登入'
      });

      const result = await login({ email, password });
      
      if (result.success) {
        // 更新開發文檔
        updateDevDocs({
          type: 'feature',
          title: '用戶登入功能使用',
          details: [
            '使用者成功登入系統',
            '更新認證狀態',
            '導航至主頁面'
          ]
        });
        
        // 導航到主頁面
        navigation.replace('Home');
      }
    } catch (err) {
      console.error('Login error:', err);
      addChange({
        component: 'LoginScreen',
        changeType: 'updated',
        description: `登入失敗: ${err instanceof Error ? err.message : '未知錯誤'}`
      });
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const { theme } = useTheme();

  return (
    <SafeAreaLayout>
      <View style={styles.container}>
        <View style={styles.themeToggleContainer}>
          <ThemeToggle showLabel={true} />
        </View>
        {__DEV__ && <TestLogin navigation={navigation} />}
        <Card style={styles.card}>
          <Text variant="headlineMedium" style={styles.title}>
            Welcome Back
          </Text>
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
            errorText={error || undefined}
          />
          <Button
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          >
            Login
          </Button>
          <Button
            onPress={handleRegister}
            mode="outlined"
            disabled={isLoading}
            style={styles.button}
          >
            Create Account
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
  themeToggleContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
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