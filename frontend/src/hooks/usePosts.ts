import { useState, useCallback, useEffect } from 'react';
import { Post, PostsQueryParams } from '../types/post';
import { postsService } from '../services/posts.service';

export function usePosts(initialParams: PostsQueryParams) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [params, setParams] = useState<PostsQueryParams>(initialParams);

  const loadPosts = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await postsService.getPosts({
        ...params,
        page,
      });

      if (page === 1) {
        setPosts(response.posts);
      } else {
        setPosts(prev => [...prev, ...response.posts]);
      }

      setHasMore(response.pagination.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入文章失敗');
      console.error('Failed to load posts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  // 初始載入
  useEffect(() => {
    loadPosts(1);
  }, [loadPosts]);

  // 重新載入
  const refresh = useCallback(() => {
    return loadPosts(1);
  }, [loadPosts]);

  // 載入更多
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = Math.ceil(posts.length / params.limit) + 1;
      return loadPosts(nextPage);
    }
  }, [isLoading, hasMore, posts.length, params.limit, loadPosts]);

  // 更改排序方式
  const changeSort = useCallback((sort: 'latest' | 'popular') => {
    setParams(prev => ({ ...prev, sort }));
  }, []);

  return {
    posts,
    isLoading,
    error,
    hasMore,
    refresh,
    loadMore,
    changeSort
  };
}