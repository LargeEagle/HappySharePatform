import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Text, Chip, useTheme } from 'react-native-paper';
import { FollowButton } from './FollowButton';
import type { FollowUser } from '../../types/follow';

interface UserCardProps {
  user: FollowUser;
  onPress?: () => void;
  onFollowChange?: (isFollowing: boolean) => void;
  showFollowButton?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onPress,
  onFollowChange,
  showFollowButton = true,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* 頭像 */}
        <View style={styles.leftSection}>
          {user.avatar ? (
            <Avatar.Image size={56} source={{ uri: user.avatar }} />
          ) : (
            <Avatar.Text
              size={56}
              label={user.username[0].toUpperCase()}
              style={{ backgroundColor: theme.colors.primary }}
            />
          )}
        </View>

        {/* 用戶信息 */}
        <View style={styles.middleSection}>
          <View style={styles.nameRow}>
            <Text variant="titleMedium" style={styles.username}>
              {user.username}
            </Text>
            {user.isMutual && (
              <Chip
                compact
                mode="flat"
                style={[styles.mutualChip, { backgroundColor: theme.colors.secondaryContainer }]}
                textStyle={{ fontSize: 11, color: theme.colors.onSecondaryContainer }}
              >
                互相關注
              </Chip>
            )}
          </View>

          {user.bio && (
            <Text
              variant="bodySmall"
              style={[styles.bio, { color: theme.colors.onSurfaceVariant }]}
              numberOfLines={2}
            >
              {user.bio}
            </Text>
          )}

          {user.followedAt && (
            <Text
              variant="labelSmall"
              style={[styles.followedAt, { color: theme.colors.outline }]}
            >
              {new Date(user.followedAt).toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          )}
        </View>

        {/* 關注按鈕 */}
        {showFollowButton && (
          <View style={styles.rightSection}>
            <FollowButton
              userId={user.id}
              initialFollowState={user.isFollowing}
              compact
              onFollowChange={onFollowChange}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSection: {
    marginRight: 12,
  },
  middleSection: {
    flex: 1,
  },
  rightSection: {
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontWeight: '600',
    marginRight: 8,
  },
  mutualChip: {
    height: 22,
  },
  bio: {
    marginBottom: 4,
    lineHeight: 18,
  },
  followedAt: {
    fontSize: 11,
  },
});
