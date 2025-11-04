import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Badge, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  showZero?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 通知徽章組件
 * 顯示未讀通知數量
 */
export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  maxCount = 99,
  showZero = false,
  size = 'md',
}) => {
  const iconSize = size === 'sm' ? 20 : size === 'md' ? 24 : 28;

  // 不顯示 0
  if (count === 0 && !showZero) {
    return (
      <MaterialCommunityIcons 
        name="bell-outline"
        size={iconSize}
        color="#666"
      />
    );
  }

  // 顯示數字或最大值
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons 
        name={count > 0 ? 'bell' : 'bell-outline'}
        size={iconSize}
        color={count > 0 ? '#FF5722' : '#666'}
      />
      {count > 0 && (
        <Badge 
          size={size === 'sm' ? 16 : size === 'md' ? 18 : 20}
          style={[
            styles.badge,
            size === 'sm' && styles.badgeSm,
            size === 'lg' && styles.badgeLg,
          ]}
        >
          {displayCount}
        </Badge>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF5722',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
  },
  badgeSm: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    fontSize: 10,
  },
  badgeLg: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    fontSize: 12,
  },
});
