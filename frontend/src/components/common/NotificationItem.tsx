import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import type { Notification, NotificationType } from '../../types/notification';

interface NotificationItemProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
  onDelete?: (notificationId: string) => void;
}

/**
 * 通知項目組件
 */
export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
  onDelete,
}) => {
  /**
   * 獲取通知圖標
   */
  const getNotificationIcon = (type: NotificationType): string => {
    switch (type) {
      case 'follow':
        return 'account-plus';
      case 'like':
        return 'heart';
      case 'comment':
        return 'comment';
      case 'reply':
        return 'reply';
      case 'mention':
        return 'at';
      case 'system':
        return 'bell';
      default:
        return 'bell';
    }
  };

  /**
   * 獲取通知圖標顏色
   */
  const getIconColor = (type: NotificationType): string => {
    switch (type) {
      case 'follow':
        return '#2196F3';
      case 'like':
        return '#F44336';
      case 'comment':
        return '#4CAF50';
      case 'reply':
        return '#FF9800';
      case 'mention':
        return '#9C27B0';
      case 'system':
        return '#607D8B';
      default:
        return '#757575';
    }
  };

  /**
   * 格式化時間
   */
  const formatTime = (createdAt: string): string => {
    const now = new Date();
    const date = new Date(createdAt);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '剛剛';
    if (diffMins < 60) return `${diffMins} 分鐘前`;
    if (diffHours < 24) return `${diffHours} 小時前`;
    if (diffDays < 7) return `${diffDays} 天前`;
    
    return date.toLocaleDateString('zh-TW');
  };

  return (
    <TouchableOpacity onPress={() => onPress(notification)}>
      <Card 
        style={[
          styles.card,
          !notification.isRead && styles.unreadCard
        ]}
      >
        <Card.Content style={styles.content}>
          <View style={styles.leftContent}>
            {/* 用戶頭像或系統圖標 */}
            {notification.actor && notification.actor.avatar ? (
              <Image
                source={{ uri: notification.actor.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.iconContainer, { backgroundColor: getIconColor(notification.type) }]}>
                <IconButton
                  icon={getNotificationIcon(notification.type)}
                  size={20}
                  iconColor="#fff"
                  style={styles.icon}
                />
              </View>
            )}

            {/* 通知內容 */}
            <View style={styles.textContainer}>
              <Text style={styles.title} variant="titleSmall">
                {notification.title}
              </Text>
              <Text style={styles.message} variant="bodyMedium">
                {notification.message}
              </Text>
              <Text style={styles.time} variant="bodySmall">
                {formatTime(notification.createdAt)}
              </Text>
            </View>
          </View>

          {/* 右側操作區 */}
          <View style={styles.rightContent}>
            {/* 未讀指示器 */}
            {!notification.isRead && (
              <View style={styles.unreadDot} />
            )}

            {/* 刪除按鈕 */}
            {onDelete && (
              <IconButton
                icon="close"
                size={18}
                onPress={() => onDelete(notification.id)}
                style={styles.deleteButton}
              />
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 4,
    elevation: 0,
    backgroundColor: '#fff',
  },
  unreadCard: {
    backgroundColor: '#E3F2FD',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    margin: 0,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    color: '#666',
    marginBottom: 4,
  },
  time: {
    color: '#999',
    fontSize: 12,
  },
  rightContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
    marginBottom: 8,
  },
  deleteButton: {
    margin: 0,
  },
});
