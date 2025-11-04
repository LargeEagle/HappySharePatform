import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 🧪 測試 Phase 1: 逐步添加依賴
// Phase 1: 測試基本 React Native 組件 ✅
// Phase 2: 測試 Expo 組件
import { Ionicons } from '@expo/vector-icons';

/**
 * 最簡化的 SearchScreen 測試版本
 * 用於驗證導航是否正常工作
 * 
 * Phase 2: 測試 Expo Vector Icons
 */
export const SearchScreenTest: React.FC = () => {
  console.log('[SearchScreenTest] ========== Component rendered! ==========');
  console.log('[SearchScreenTest] Phase 2: Testing with Expo Vector Icons');
  
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={48} color="#666" />
      <Text style={styles.title}>🎉 Search Screen Test - Phase 2</Text>
      <Text style={styles.subtitle}>Testing Expo Vector Icons</Text>
      <Text style={styles.info}>Check console for logs</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#666',
  },
  info: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});
