// HAPPY SHARE - 標籤列表組件

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TagChip } from './TagChip';
import type { Tag } from '../../types/search';

interface TagsListProps {
  tags: Tag[];
  onTagPress?: (tag: Tag) => void;
  showCount?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  horizontal?: boolean;
  wrap?: boolean;
}

export const TagsList: React.FC<TagsListProps> = ({
  tags,
  onTagPress,
  showCount = false,
  variant = 'default',
  horizontal = false,
  wrap = true,
}) => {
  if (tags.length === 0) {
    return null;
  }

  if (horizontal) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalContainer}
      >
        {tags.map((tag) => (
          <TagChip
            key={tag.id}
            tag={tag}
            onPress={onTagPress}
            showCount={showCount}
            variant={variant}
          />
        ))}
      </ScrollView>
    );
  }

  if (wrap) {
    return (
      <View style={styles.wrapContainer}>
        {tags.map((tag) => (
          <TagChip
            key={tag.id}
            tag={tag}
            onPress={onTagPress}
            showCount={showCount}
            variant={variant}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.verticalContainer}>
      {tags.map((tag) => (
        <TagChip
          key={tag.id}
          tag={tag}
          onPress={onTagPress}
          showCount={showCount}
          variant={variant}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  wrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  verticalContainer: {
    gap: 8,
  },
});
