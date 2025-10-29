// HAPPY SHARE - 標籤文章列表畫面

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { tagsService } from '../services';
import type { Tag } from '../types/search';
import type { Post } from '../types/post';
import { PostCard } from '../components/common/PostCard';
import { useTheme } from '../hooks/useTheme';

type TagPostsRouteProp = RouteProp<{ TagPosts: { slug: string } }, 'TagPosts'>;

interface State {
  tag: Tag | null;
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  page: number;
  hasMore: boolean;
}

export const TagPostsScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<TagPostsRouteProp>();
  const navigation = useNavigation();
  const { slug } = route.params;

  const [state, setState] = useState<State>({
    tag: null,
    posts: [],
    loading: true,
    refreshing: false,
    page: 1,
    hasMore: true,
  });

  useEffect(() => {
    loadTagAndPosts();
  }, [slug]);

  const loadTagAndPosts = async () => {
    try {
      const [tagData, postsData] = await Promise.all([
        tagsService.getTag(slug),
        tagsService.getTagPosts({ slug, page: 1, limit: 20 }),
      ]);

      setState((prev) => ({
        ...prev,
        tag: tagData,
        posts: postsData.data.posts,
        loading: false,
        hasMore: postsData.data.pagination.hasMore,
      }));

      // 設置導航標題
      navigation.setOptions({
        title: `#${tagData.name}`,
      });
    } catch (error) {
      console.error('Failed to load tag posts:', error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleRefresh = async () => {
    setState((prev) => ({ ...prev, refreshing: true, page: 1 }));
    
    try {
      const response = await tagsService.getTagPosts({
        slug,
        page: 1,
        limit: 20,
      });

      setState((prev) => ({
        ...prev,
        posts: response.data.posts,
        refreshing: false,
        page: 1,
        hasMore: response.data.pagination.hasMore,
      }));
    } catch (error) {
      console.error('Failed to refresh:', error);
      setState((prev) => ({ ...prev, refreshing: false }));
    }
  };

  const handleLoadMore = async () => {
    if (!state.hasMore || state.refreshing) return;

    const nextPage = state.page + 1;

    try {
      const response = await tagsService.getTagPosts({
        slug,
        page: nextPage,
        limit: 20,
      });

      setState((prev) => ({
        ...prev,
        posts: [...prev.posts, ...response.data.posts],
        page: nextPage,
        hasMore: response.data.pagination.hasMore,
      }));
    } catch (error) {
      console.error('Failed to load more:', error);
    }
  };

  const renderHeader = () => {
    if (!state.tag) return null;

    return (
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.tagName, { color: theme.colors.onSurface }]}>
          #{state.tag.name}
        </Text>
        {state.tag.description && (
          <Text style={[styles.tagDescription, { color: theme.colors.onSurfaceVariant }]}>
            {state.tag.description}
          </Text>
        )}
        <Text style={[styles.tagStats, { color: theme.colors.onSurfaceVariant }]}>
          {state.tag.postsCount} 篇文章
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!state.hasMore) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
        此標籤下還沒有文章
      </Text>
    </View>
  );

  if (state.loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={state.posts}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={state.refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    marginBottom: 16,
  },
  tagName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  tagDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  tagStats: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
  },
});
