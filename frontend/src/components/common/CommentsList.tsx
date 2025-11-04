import React, { useState } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, ActivityIndicator, Text, IconButton } from 'react-native-paper';
import { CommentItem } from './CommentItem';
import { useAppTheme } from '../../providers/ThemeProvider';
import type { Comment } from '../../services/postInteraction.service';

interface CommentsListProps {
  comments: Comment[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  onLoadMore: () => void;
  onRefresh: () => void;
  onCreateComment: (content: string, parentId?: string, replyToUsername?: string) => Promise<void>;
  onLikeComment: (commentId: string) => void;
}

export function CommentsList({
  comments,
  isLoading,
  hasMore,
  error,
  onLoadMore,
  onRefresh,
  onCreateComment,
  onLikeComment
}: CommentsListProps) {
  const { theme } = useAppTheme();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: string; username: string } | null>(null);

  const handleReply = (commentId: string, username: string) => {
    setReplyingTo({ id: commentId, username });
    // 可以自動滾動到輸入框
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      
      // 如果是回覆，傳遞父評論信息
      if (replyingTo) {
        await onCreateComment(newComment.trim(), replyingTo.id, replyingTo.username);
      } else {
        await onCreateComment(newComment.trim());
      }
      
      setNewComment('');
      setReplyingTo(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <ActivityIndicator 
        animating={true}
        style={styles.loadingIndicator}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <CommentItem
            comment={item}
            onLike={onLikeComment}
            onReply={handleReply}
          />
        )}
        keyExtractor={item => item.id}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          isLoading ? null : (
            <View style={styles.emptyContainer}>
              <Text>暫無評論</Text>
            </View>
          )
        }
      />

      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}

      <View style={[styles.inputContainer, { borderTopColor: theme.colors.surfaceVariant }]}>
        {replyingTo && (
          <View style={[styles.replyingIndicator, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSecondaryContainer }}>
              回覆 @{replyingTo.username}
            </Text>
            <IconButton
              icon="close"
              size={16}
              onPress={cancelReply}
            />
          </View>
        )}
        <View style={styles.inputRow}>
          <TextInput
            mode="outlined"
            placeholder={replyingTo ? `回覆 @${replyingTo.username}...` : "分享你的想法..."}
            value={newComment}
            onChangeText={setNewComment}
            style={styles.input}
            multiline
            maxLength={500}
            disabled={isSubmitting}
          />
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={!newComment.trim() || isSubmitting}
            style={styles.submitButton}
          >
            發布
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingIndicator: {
    paddingVertical: 16,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    padding: 16,
    textAlign: 'center',
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  replyingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    maxHeight: 100,
  },
  submitButton: {
    marginLeft: 8,
  },
});