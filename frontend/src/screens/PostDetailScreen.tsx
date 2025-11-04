import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { ActivityIndicator, Text, Avatar, Chip, IconButton, Surface, Portal, Modal, Menu, Button } from 'react-native-paper';
import { SafeAreaLayout } from '../components/layout';
import { TagsList, MapPreview, ImageCarousel, ImageViewer } from '../components/common';
import { useAppTheme } from '../providers/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { usePost } from '../hooks/usePost';
import { usePostInteraction } from '../hooks/usePostInteraction';
import { usePostManagement } from '../hooks/usePostManagement';
import { CommentsList } from '../components/common/CommentsList';
import { updateDevDocs } from '../utils/devDocs';

type Props = NativeStackScreenProps<RootStackParamList, 'PostDetails'>;

function PostDetailScreen({ route, navigation }: Props) {
  const { theme } = useAppTheme();
  const { postId } = route.params;
  const { post, isLoading, error } = usePost(postId);
  const { deletePost, togglePublish, isLoading: isManaging } = usePostManagement();
  
  // ⚠️ 重要：所有 hooks 必須在條件渲染之前調用
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
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [isCommentsVisible, setCommentsVisible] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);

  const handleEdit = () => {
    setMenuVisible(false);
    navigation.navigate('EditPost', { postId });
  };

  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert(
      '刪除文章',
      '確定要刪除這篇文章嗎？此操作無法復原。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '刪除',
          style: 'destructive',
          onPress: async () => {
            const success = await deletePost(postId);
            if (success) {
              updateDevDocs({
                type: 'feature',
                title: '文章刪除功能使用',
                details: [
                  `文章 "${post?.title}" 已成功刪除`,
                  '文章已從列表中移除',
                  '返回首頁'
                ]
              });
              Alert.alert('成功', '文章已刪除', [
                { text: '確定', onPress: () => navigation.goBack() }
              ]);
            }
          }
        }
      ]
    );
  };

  const handleTogglePublish = async () => {
    setMenuVisible(false);
    const result = await togglePublish(postId);
    if (result) {
      const action = result.isPublished ? '已發布' : '已取消發布';
      updateDevDocs({
        type: 'feature',
        title: '文章發布狀態切換',
        details: [
          `文章 "${post?.title}" ${action}`,
          `發布狀態: ${result.isPublished ? '公開' : '私密'}`,
          '狀態已更新'
        ]
      });
      Alert.alert('成功', `文章${action}`);
    }
  };

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

  const handleShowComments = () => {
    setCommentsVisible(true);
  };

  return (
    <SafeAreaLayout>
      <Surface style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
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
            
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={() => setMenuVisible(true)}
                />
              }
            >
              <Menu.Item
                onPress={handleEdit}
                title="編輯文章"
                leadingIcon="pencil"
                disabled={isManaging}
              />
              <Menu.Item
                onPress={handleTogglePublish}
                title={post.isPublished ? "取消發布" : "發布文章"}
                leadingIcon={post.isPublished ? "eye-off" : "eye"}
                disabled={isManaging}
              />
              <Menu.Item
                onPress={handleDelete}
                title="刪除文章"
                leadingIcon="delete"
                disabled={isManaging}
              />
            </Menu>
          </View>
          
          {/* 標籤顯示 - 支持新舊兩種格式 */}
          {post.postTags && post.postTags.length > 0 && (
            <View style={styles.tags}>
              <TagsList
                tags={post.postTags.map(pt => pt.tag)}
                variant="filled"
                horizontal={true}
              />
            </View>
          )}
          {/* 舊格式標籤，向後兼容 */}
          {!post.postTags && post.tags && post.tags.length > 0 && (
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

        {/* 圖片輪播 */}
        {post.images && post.images.length > 0 && (
          <View style={styles.imagesContainer}>
            <ImageCarousel
              images={post.images}
              height={300}
              showIndicator={true}
              onImagePress={(index) => {
                setImageViewerIndex(index);
                setShowImageViewer(true);
              }}
            />
          </View>
        )}

        {/* 位置信息顯示 */}
        {post.location && (
          <View style={styles.locationSection}>
            <MapPreview
              location={post.location}
              height={200}
            />
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

        {/* 圖片查看器 */}
        {post && post.images && post.images.length > 0 && (
          <ImageViewer
            images={post.images}
            initialIndex={imageViewerIndex}
            visible={showImageViewer}
            onClose={() => setShowImageViewer(false)}
          />
        )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    marginBottom: 16,
  },
  imagesContainer: {
    marginBottom: 16,
  },
  locationSection: {
    marginTop: 16,
    paddingHorizontal: 16,
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