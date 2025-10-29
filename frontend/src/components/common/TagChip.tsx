// HAPPY SHARE - 標籤芯片組件

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import type { Tag } from '../../types/search';

interface TagChipProps {
  tag: Tag;
  onPress?: (tag: Tag) => void;
  showCount?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
}

export const TagChip: React.FC<TagChipProps> = ({
  tag,
  onPress,
  showCount = false,
  variant = 'default',
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress(tag);
    } else {
      // 默認跳轉到標籤文章頁面
      navigation.navigate('TagPosts' as never, { slug: tag.slug } as never);
    }
  };

  const getContainerStyle = () => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: theme.colors.primaryContainer,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.outline,
        };
      default:
        return {
          backgroundColor: theme.colors.surfaceVariant,
          borderWidth: 0,
        };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'filled':
        return theme.colors.onPrimaryContainer;
      case 'outlined':
        return theme.colors.onSurface;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, getContainerStyle()]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={[styles.tagText, { color: getTextColor() }]}>
        #{tag.name}
      </Text>
      {showCount && (
        <View style={[styles.countBadge, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.countText, { color: theme.colors.onPrimary }]}>
            {tag.postsCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  countBadge: {
    minWidth: 20,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
