// 最小化 SearchScreen - 用於診斷問題
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

// 🧪 Phase 3-A: 先測試 apiClient
console.log('[SearchScreenMinimal] Phase 3-A: 開始導入 apiClient...');
import { apiClient } from '../services/api.client';
console.log('[SearchScreenMinimal] ✅ apiClient 導入成功！');

console.log('[SearchScreenMinimal] 文件被加載');

export const SearchScreenMinimal: React.FC = () => {
  console.log('[SearchScreenMinimal] 組件函數被調用');
  
  console.log('[SearchScreenMinimal] Phase 3-A: Testing apiClient import...');
  const { theme } = useTheme();
  console.log('[SearchScreenMinimal] useTheme 成功！');
  console.log('[SearchScreenMinimal] apiClient:', apiClient ? 'exists' : 'null');
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.text, { color: theme.colors.onSurface }]}>
        Phase 3-A: apiClient Import Test
      </Text>
      <Text style={[styles.subtext, { color: theme.colors.onSurfaceVariant }]}>
        apiClient: {apiClient ? '✅ OK' : '❌ Failed'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: '#666',
  },
});
