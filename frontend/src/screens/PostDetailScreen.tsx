import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text, Avatar, Chip, IconButton, Surface, Portal, Modal } from 'react-native-paper';
import { SafeAreaLayout } from '../components/layout';
import { useAppTheme } from '../providers/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { usePost } from '../hooks/usePost';
import { usePostInteraction } from '../hooks/usePostInteraction';
import { CommentsList } from '../components/common/CommentsList';

type Props = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;

function PostDetailScreen({ route }: Props) {
  const { theme } = useAppTheme();
  const { postId } = route.params;
  const { post, isLoading, error } = usePost(postId);

  if (isLoading) {
    return (
      <SafeAreaLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaLayout>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaLayout>
        <View style={styles.errorContainer}>
          <Text variant="bodyLarge" style={{ color: theme.colors.error }}>
            {error || '無法載入文章'}
          </Text>
        </View>
      </SafeAreaLayout>
    );
  }

  const { 
    comments,
    isLoading: isLoadingComments,
    error: commentError,
    hasMore,
    createComment,
    toggleCommentLike,
    togglePostLike,
    toggleBookmark,
    loadMoreComments,
    refreshComments
  } = usePostInteraction({ postId });

  const [isCommentsVisible, setCommentsVisible] = useState(false);

  const handleShowComments = () => {
    setCommentsVisible(true);
  };

  return (
    <SafeAreaLayout>
      <Surface style={styles.container}>
        <View style={styles.header}>
          <View style={styles.authorInfo}>
            {post.author.avatar ? (
              <Avatar.Image size={48} source={{ uri: post.author.avatar }} />
            ) : (
              <Avatar.Text 
                size={48} 
                label={post.author.username[0].toUpperCase()}
                color={theme.colors.onPrimary}
                style={{ backgroundColor: theme.colors.primary }}
              />
            )}
            <View style={styles.authorText}>
              <Text variant="titleMedium">{post.author.username}</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
                {new Date(post.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          
          {post.tags && post.tags.length > 0 && (
            <View style={styles.tags}>
              {post.tags.map((tag: string) => (
                <Chip 
                  key={tag}
                  style={[
                    styles.tag,
                    { backgroundColor: theme.colors.secondaryContainer }
                  ]}
                  textStyle={{ color: theme.colors.onSecondaryContainer }}
                >
                  {tag}
                </Chip>
              ))}
            </View>
          )}
        </View>

        <Text variant="headlineMedium" style={styles.title}>
          {post.title}
        </Text>

        <Text variant="bodyLarge" style={styles.content}>
          {post.content}
        </Text>

        {post.images && post.images.length > 0 && (
          <View style={styles.imagesContainer}>
            {/* TODO: 實現圖片展示 */}
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.actions}>
            <IconButton
              icon={post.isLiked ? "heart" : "heart-outline"}
              iconColor={post.isLiked ? theme.colors.error : theme.colors.onSurface}
              onPress={togglePostLike}
            />
            <IconButton
              icon="comment-outline"
              onPress={handleShowComments}
            />
            <IconButton
              icon={post.isBookmarked ? "bookmark" : "bookmark-outline"}
              onPress={toggleBookmark}
            />
          </View>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {post.likes} 個讚 · {post.comments} 則留言
          </Text>
        </View>
      </Surface>

      <Portal>
        <Modal
          visible={isCommentsVisible}
          onDismiss={() => setCommentsVisible(false)}
          contentContainerStyle={[
            styles.commentsModal,
            { backgroundColor: theme.colors.surface }
          ]}
        >
          <CommentsList
            comments={comments}
            isLoading={isLoadingComments}
            hasMore={hasMore}
            error={commentError}
            onLoadMore={loadMoreComments}
            onRefresh={refreshComments}
            onCreateComment={createComment}
            onLikeComment={toggleCommentLike}
          />
        </Modal>
      </Portal>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    padding: 16,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorText: {
    marginLeft: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  title: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  content: {
    paddingHorizontal: 16,
    lineHeight: 24,
  },
  imagesContainer: {
    padding: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    marginTop: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentsModal: {
    flex: 1,
    margin: 0,
    marginTop: 50,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
});

export default PostDetailScreen;