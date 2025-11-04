import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notification.service';

/**
 * 通知徽章 Hook（未讀數量）
 */
export const useNotificationBadge = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 載入未讀數量
   */
  const loadUnreadCount = useCallback(async () => {
    try {
      setIsLoading(true);
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('載入未讀數量失敗:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 初始載入
   */
  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  /**
   * 刷新未讀數量
   */
  const refresh = useCallback(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  /**
   * 減少未讀數量
   */
  const decreaseCount = useCallback((amount: number = 1) => {
    setUnreadCount(prev => Math.max(0, prev - amount));
  }, []);

  /**
   * 重置未讀數量
   */
  const resetCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return {
    unreadCount,
    isLoading,
    refresh,
    decreaseCount,
    resetCount,
  };
};
