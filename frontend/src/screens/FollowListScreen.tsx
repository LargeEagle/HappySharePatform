import React, { useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { SegmentedButtons, ActivityIndicator, Text, Appbar } from 'react-native-paper';
import { SafeAreaLayout } from '../components/layout';
import { UserCard } from '../components/common';
import { useAppTheme } from '../providers/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useFollowList } from '../hooks/useFollowList';
import type { FollowUser } from '../types/follow';

type Props = NativeStackScreenProps<RootStackParamList, 'FollowList'>;

type TabType = 'followers' | 'following' | 'mutual';

export function FollowListScreen({ route, navigation }: Props) {
  const { theme } = useAppTheme();
  const { userId, initialTab = 'followers' } = route.params;
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  const {
    users,
    isLoading,
    isRefreshing,
    error,
    hasMore,
    totalCount,
    loadMore,
    refresh,
    updateUserFollowStatus,
  } = useFollowList(userId, activeTab);

  const handleUserPress = (user: FollowUser) => {
    navigation.navigate('Profile', { userId: user.id });
  };

  const handleFollowChange = (userId: string, isFollowing: boolean) => {
    updateUserFollowStatus(userId, isFollowing);
  };

  const renderItem = ({ item }: { item: FollowUser }) => (
    <UserCard
      user={item}
      onPress={() => handleUserPress(item)}
      onFollowChange={(isFollowing) => handleFollowChange(item.id, isFollowing)}
      showFollowButton={true}
    />
  );

  const renderEmpty = () => {
    if (isLoading) return null;

    let message = '';
    switch (activeTab) {
      case 'followers':
        message = '還沒有粉絲';
        break;
      case 'following':
        message = '還沒有關注任何人';
        break;
      case 'mutual':
        message = '還沒有互相關注的朋友';
        break;
    }

    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
          {message}
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoading || users.length === 0) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  return (
    <SafeAreaLayout style={{ backgroundColor: theme.colors.background }}>
      {/* 頂部導航欄 */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="關注" />
      </Appbar.Header>

      {/* 分頁標籤 */}
      <View style={styles.segmentContainer}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabType)}
          buttons={[
            {
              value: 'followers',
              label: `粉絲 ${activeTab === 'followers' ? `(${totalCount})` : ''}`,
            },
            {
              value: 'following',
              label: `關注 ${activeTab === 'following' ? `(${totalCount})` : ''}`,
            },
            {
              value: 'mutual',
              label: `互相關注 ${activeTab === 'mutual' ? `(${totalCount})` : ''}`,
            },
          ]}
          style={styles.segmentButtons}
        />
      </View>

      {/* 用戶列表 */}
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={refresh}
        contentContainerStyle={users.length === 0 ? styles.emptyList : undefined}
      />

      {/* 錯誤提示 */}
      {error && (
        <View style={styles.errorContainer}>
          <Text variant="bodyMedium" style={{ color: theme.colors.error }}>
            {error}
          </Text>
        </View>
      )}

      {/* 初始載入指示器 */}
      {isLoading && users.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  segmentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  segmentButtons: {
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyList: {
    flexGrow: 1,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
