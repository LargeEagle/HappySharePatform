import { useState, useCallback, useEffect } from 'react';
import { followService } from '../services/follow.service';
import type { FollowUser, FollowListParams } from '../types/follow';

type FollowListType = 'followers' | 'following' | 'mutual';

/**
 * 關注列表 Hook
 */
export const useFollowList = (userId: string, type: FollowListType) => {
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const LIMIT = 20;

  /**
   * 載入用戶列表
   */
  const loadUsers = useCallback(async (page: number, refresh = false) => {
    if (isLoading) return;

    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const params: Omit<FollowListParams, 'type'> = {
        userId,
        page,
        limit: LIMIT,
      };

      let response;
      switch (type) {
        case 'followers':
          response = await followService.getFollowers(params);
          break;
        case 'following':
          response = await followService.getFollowing(params);
          break;
        case 'mutual':
          response = await followService.getMutualFollows(params);
          break;
      }

      if (refresh || page === 1) {
        setUsers(response.users);
      } else {
        setUsers(prev => [...prev, ...response.users]);
      }

      setCurrentPage(page);
      setHasMore(response.pagination.hasMore);
      setTotalCount(response.pagination.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '載入失敗';
      setError(errorMessage);
      console.error('Load follow list error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [userId, type, isLoading]);

  /**
   * 載入更多
   */
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadUsers(currentPage + 1);
    }
  }, [isLoading, hasMore, currentPage, loadUsers]);

  /**
   * 刷新列表
   */
  const refresh = useCallback(() => {
    loadUsers(1, true);
  }, [loadUsers]);

  /**
   * 更新單個用戶的關注狀態
   */
  const updateUserFollowStatus = useCallback((targetUserId: string, isFollowing: boolean) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === targetUserId
          ? {
              ...user,
              isFollowing,
              isMutual: isFollowing && user.isFollower,
            }
          : user
      )
    );
  }, []);

  /**
   * 初始載入
   */
  useEffect(() => {
    loadUsers(1);
  }, [userId, type]); // 只在 userId 或 type 改變時載入

  return {
    users,
    isLoading,
    isRefreshing,
    error,
    hasMore,
    totalCount,
    loadMore,
    refresh,
    updateUserFollowStatus,
  };
};
