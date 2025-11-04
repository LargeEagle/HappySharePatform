import React, { memo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Avatar, IconButton } from 'react-native-paper';
import { useAppTheme } from '../../providers/ThemeProvider';
import { Comment } from '../../services/postInteraction.service';

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onReply: (commentId: string, username: string) => void; // 新增回覆回調
  depth?: number; // 新增：嵌套深度
}

export const CommentItem = memo<CommentItemProps>(({ comment, onLike, onReply, depth = 0 }) => {
  const { theme } = useAppTheme();
  const formattedDate = new Date(comment.createdAt).toLocaleDateString();
  const maxDepth = 3; // 最大嵌套深度

  return (
    <View style={[styles.container, depth > 0 && { marginLeft: 20 * depth }, { borderBottomColor: theme.colors.surfaceVariant }]}>
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
            {comment.replyTo && (
              <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
                {' '}回覆 @{comment.replyTo.username}
              </Text>
            )}
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

        {depth < maxDepth && (
          <Pressable
            style={styles.replyButton}
            onPress={() => onReply(comment.id, comment.author.username)}
          >
            <IconButton
              icon="reply"
              size={16}
              iconColor={theme.colors.onSurfaceVariant}
            />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              回覆
            </Text>
          </Pressable>
        )}
      </View>

      {/* 顯示回覆列表 */}
      {comment.replies && comment.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </View>
      )}
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
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  repliesContainer: {
    marginTop: 8,
  },
});