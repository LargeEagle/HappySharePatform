import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Appbar, Menu, Button, Text, FAB } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from '../components/common/NotificationItem';
import type { Notification, NotificationType } from '../types/notification';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

/**
 * 通知列表畫面
 */
export const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const [filterType, setFilterType] = useState<NotificationType | undefined>(undefined);
  const [menuVisible, setMenuVisible] = useState(false);

  const {
    notifications,
    isLoading,
    isRefreshing,
    error,
    unreadCount,
    hasMore,
    refresh,
    loadMore,
    markOneAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications({ type: filterType });

  /**
   * 處理通知點擊
   */
  const handleNotificationPress = async (notification: Notification) => {
    // 標記為已讀
    if (!notification.isRead) {
      await markOneAsRead(notification.id);
    }

    // 根據通知類型導航
    switch (notification.type) {
      case 'follow':
        if (notification.actor) {
          navigation.navigate('Profile', { userId: notification.actor.id });
        }
        break;
      case 'like':
      case 'comment':
      case 'reply':
        if (notification.targetId && notification.targetType === 'post') {
          navigation.navigate('PostDetail', { postId: notification.targetId });
        }
        break;
      default:
        break;
    }
  };

  /**
   * 處理刪除通知
   */
  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error('刪除通知失敗:', error);
    }
  };

  /**
   * 處理標記全部已讀
   */
  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setMenuVisible(false);
    } catch (error) {
      console.error('標記全部已讀失敗:', error);
    }
  };

  /**
   * 處理清除全部
   */
  const handleClearAll = async () => {
    try {
      await clearAll();
      setMenuVisible(false);
    } catch (error) {
      console.error('清除全部失敗:', error);
    }
  };

  /**
   * 渲染通知項目
   */
  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationItem
      notification={item}
      onPress={handleNotificationPress}
      onDelete={handleDelete}
    />
  );

  /**
   * 渲染空狀態
   */
  const renderEmpty = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyLarge" style={styles.emptyText}>
          {filterType ? '沒有此類型的通知' : '目前沒有通知'}
        </Text>
      </View>
    );
  };

  /**
   * 渲染列表底部
   */
  const renderFooter = () => {
    if (!hasMore || isLoading) return null;

    return (
      <Button 
        mode="text" 
        onPress={loadMore}
        style={styles.loadMoreButton}
      >
        載入更多
      </Button>
    );
  };

  return (
    <View style={styles.container}>
      {/* 標題欄 */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content 
          title="通知" 
          subtitle={unreadCount > 0 ? `${unreadCount} 則未讀` : undefined}
        />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action 
              icon="dots-vertical" 
              onPress={() => setMenuVisible(true)} 
            />
          }
        >
          <Menu.Item 
            onPress={handleMarkAllRead} 
            title="全部標示為已讀"
            leadingIcon="check-all"
            disabled={unreadCount === 0}
          />
          <Menu.Item 
            onPress={handleClearAll} 
            title="清除全部通知"
            leadingIcon="delete-sweep"
            disabled={notifications.length === 0}
          />
          <Menu.Item 
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('NotificationSettings');
            }} 
            title="通知設定"
            leadingIcon="cog"
          />
        </Menu>
      </Appbar.Header>

      {/* 錯誤訊息 */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* 通知列表 */}
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
          />
        }
        contentContainerStyle={
          notifications.length === 0 ? styles.emptyList : undefined
        }
      />

      {/* 篩選 FAB */}
      <FAB
        icon="filter-variant"
        style={styles.fab}
        onPress={() => {
          // TODO: 實現篩選對話框
          console.log('Open filter dialog');
        }}
        label={filterType ? '篩選中' : '篩選'}
        variant={filterType ? 'primary' : 'surface'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
  },
  emptyList: {
    flexGrow: 1,
  },
  loadMoreButton: {
    marginVertical: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
