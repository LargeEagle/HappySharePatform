import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { useFollow } from '../../hooks/useFollow';

interface FollowButtonProps {
  userId: string;
  initialFollowState?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
  compact?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  initialFollowState = false,
  variant = 'contained',
  compact = false,
  onFollowChange,
}) => {
  const theme = useTheme();
  const { isFollowing, isLoading, toggleFollow } = useFollow(userId, initialFollowState);

  const handlePress = async () => {
    const result = await toggleFollow();
    if (result && onFollowChange) {
      onFollowChange(result.isFollowing);
    }
  };

  // 根據關注狀態設置按鈕樣式
  const buttonMode = isFollowing ? 'outlined' : variant;
  const buttonColor = isFollowing ? theme.colors.outline : theme.colors.primary;

  return (
    <Button
      mode={buttonMode}
      onPress={handlePress}
      loading={isLoading}
      disabled={isLoading}
      compact={compact}
      style={[
        styles.button,
        isFollowing && styles.followingButton,
      ]}
      labelStyle={[
        styles.label,
        compact && styles.compactLabel,
      ]}
      contentStyle={compact ? styles.compactContent : undefined}
    >
      {isFollowing ? '已關注' : '關注'}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: 80,
  },
  followingButton: {
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  compactLabel: {
    fontSize: 12,
  },
  compactContent: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
