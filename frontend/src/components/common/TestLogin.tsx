import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/useAuth';
import { testAccounts } from '../../config/app.config';
import { updateDevDocs } from '../../utils/devDocs';
import { RootStackParamList } from '../../types/navigation';

interface TestLoginProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
}

export function TestLogin({ navigation }: TestLoginProps) {
  const { login } = useAuth();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({
    admin: false,
    user: false,
    demo: false
  });

  const handleTestLogin = useCallback(async (accountType: 'admin' | 'user' | 'demo') => {
    const account = testAccounts[accountType];
    setLoadingStates(prev => ({ ...prev, [accountType]: true }));
    
    try {
      // 嘗試登入前記錄
      console.log(`TestLogin: Attempting to login with ${accountType} account:`, account.email);
      
      const result = await login({
        email: account.email,
        password: account.password
      });

      console.log('TestLogin: Login result:', result);

      if (result.success) {
        console.log('TestLogin: Login successful, user:', result.user);
        
        // 登入成功後記錄
        updateDevDocs({
          type: 'feature',
          title: '測試帳號登入功能驗證',
          details: [
            `${accountType} 帳號登入成功`,
            '身份驗證流程完成',
            '用戶狀態已更新'
          ]
        });
        
        // 不需要手動導航，App.tsx 會根據 isAuthenticated 自動切換
        console.log('TestLogin: Authentication complete, waiting for auto-navigation...');
      } else {
        console.error('TestLogin: Login failed:', result.error);
      }
    } catch (error) {
      console.error('TestLogin: Login error:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [accountType]: false }));
    }
  }, [login]);

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>測試帳號快速登入</Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => handleTestLogin('admin')}
            loading={loadingStates.admin}
            style={styles.button}
          >
            管理員登入
          </Button>
          <Button
            mode="contained"
            onPress={() => handleTestLogin('user')}
            loading={loadingStates.user}
            style={styles.button}
          >
            測試用戶登入
          </Button>
          <Button
            mode="contained"
            onPress={() => handleTestLogin('demo')}
            loading={loadingStates.demo}
            style={styles.button}
          >
            演示帳號登入
          </Button>
        </View>
        <Text variant="bodySmall" style={styles.note}>
          * 這些按鈕僅在開發環境中顯示
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 8,
  },
  button: {
    marginVertical: 4,
  },
  note: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
});