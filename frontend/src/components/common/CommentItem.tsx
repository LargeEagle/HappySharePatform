import React, { memo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Avatar, IconButton } from 'react-native-paper';
import { useAppTheme } from '../../providers/ThemeProvider';
import { Comment } from '../../services/postInteraction.service';

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
}

export const CommentItem = memo<CommentItemProps>(({ comment, onLike }) => {
  const { theme } = useAppTheme();
  const formattedDate = new Date(comment.createdAt).toLocaleDateString();

  return (
    <View style={[styles.container, { borderBottomColor: theme.colors.surfaceVariant }]}>
      <View style={styles.header}>
        {comment.author.avatar ? (
          <Avatar.Image size={32} source={{ uri: comment.author.avatar }} />
        ) : (
          <Avatar.Text
            size={32}
            label={comment.author.username[0].toUpperCase()}
            color={theme.colors.onPrimary}
            style={{ backgroundColor: theme.colors.primary }}
          />
        )}
        <View style={styles.authorInfo}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
            {comment.author.username}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {formattedDate}
          </Text>
        </View>
      </View>

      <Text variant="bodyMedium" style={[styles.content, { color: theme.colors.onSurface }]}>
        {comment.content}
      </Text>

      <View style={styles.footer}>
        <Pressable
          style={styles.likeButton}
          onPress={() => onLike(comment.id)}
        >
          <IconButton
            icon={comment.isLiked ? "heart" : "heart-outline"}
            size={16}
            iconColor={comment.isLiked ? theme.colors.error : theme.colors.onSurfaceVariant}
          />
          <Text
            variant="bodySmall"
            style={{ color: comment.isLiked ? theme.colors.error : theme.colors.onSurfaceVariant }}
          >
            {comment.likes}
          </Text>
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorInfo: {
    marginLeft: 8,
  },
  content: {
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});