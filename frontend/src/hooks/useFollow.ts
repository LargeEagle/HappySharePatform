import { useState, useCallback } from 'react';
import { followService } from '../services/follow.service';
import type { FollowActionResponse, FollowStats } from '../types/follow';

/**
 * 關注操作 Hook
 */
export const useFollow = (userId: string, initialFollowState = false) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<FollowStats | null>(null);

  /**
   * 切換關注狀態
   */
  const toggleFollow = useCallback(async (): Promise<FollowActionResponse | null> => {
    if (isLoading) return null;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await followService.toggleFollow(userId, isFollowing);
      setIsFollowing(response.isFollowing);
      
      // 更新統計數據
      if (stats) {
        setStats({
          ...stats,
          followersCount: response.followersCount,
          followingCount: response.followingCount,
        });
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '操作失敗';
      setError(errorMessage);
      console.error('Toggle follow error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId, isFollowing, isLoading, stats]);

  /**
   * 關注用戶
   */
  const follow = useCallback(async (): Promise<FollowActionResponse | null> => {
    if (isFollowing || isLoading) return null;
    return toggleFollow();
  }, [isFollowing, isLoading, toggleFollow]);

  /**
   * 取消關注用戶
   */
  const unfollow = useCallback(async (): Promise<FollowActionResponse | null> => {
    if (!isFollowing || isLoading) return null;
    return toggleFollow();
  }, [isFollowing, isLoading, toggleFollow]);

  /**
   * 載入關注統計
   */
  const loadStats = useCallback(async () => {
    try {
      const statsData = await followService.getFollowStats(userId);
      setStats(statsData);
    } catch (err) {
      console.error('Load follow stats error:', err);
    }
  }, [userId]);

  /**
   * 檢查關注狀態
   */
  const checkStatus = useCallback(async () => {
    try {
      const status = await followService.checkFollowStatus(userId);
      setIsFollowing(status.isFollowing);
      return status;
    } catch (err) {
      console.error('Check follow status error:', err);
      return null;
    }
  }, [userId]);

  return {
    isFollowing,
    isLoading,
    error,
    stats,
    toggleFollow,
    follow,
    unfollow,
    loadStats,
    checkStatus,
  };
};
