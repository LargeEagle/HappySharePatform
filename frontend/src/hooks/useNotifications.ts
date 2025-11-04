import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notification.service';
import type {
  Notification,
  NotificationQueryParams,
  NotificationListResponse,
} from '../types/notification';

/**
 * 通知列表 Hook
 */
export const useNotifications = (initialParams?: Partial<NotificationQueryParams>) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const limit = initialParams?.limit || 20;
  const type = initialParams?.type;
  const isRead = initialParams?.isRead;

  /**
   * 載入通知
   */
  const loadNotifications = useCallback(
    async (pageNum: number, append: boolean = false) => {
      try {
        if (pageNum === 1) {
          setIsLoading(true);
        }

        const params: Partial<NotificationQueryParams> = {
          page: pageNum,
          limit,
          type,
          isRead,
        };

        const response: NotificationListResponse = await notificationService.getNotifications(params);

        if (append) {
          setNotifications(prev => [...prev, ...response.notifications]);
        } else {
          setNotifications(response.notifications);
        }

        setUnreadCount(response.unreadCount);
        setHasMore(response.pagination.hasMore);
        setPage(pageNum);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入通知失敗');
        console.error('載入通知失敗:', err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [limit, type, isRead]
  );

  /**
   * 初始載入
   */
  useEffect(() => {
    loadNotifications(1);
  }, [loadNotifications]);

  /**
   * 刷新
   */
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadNotifications(1);
  }, [loadNotifications]);

  /**
   * 載入更多
   */
  const loadMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      await loadNotifications(page + 1, true);
    }
  }, [isLoading, hasMore, page, loadNotifications]);

  /**
   * 標記為已讀
   */
  const markAsRead = useCallback(
    async (notificationIds: string[]) => {
      try {
        const response = await notificationService.markAsRead(notificationIds);

        // 更新本地狀態
        setNotifications(prev =>
          prev.map(n =>
            notificationIds.includes(n.id) ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(response.unreadCount);

        return response;
      } catch (err) {
        console.error('標記已讀失敗:', err);
        throw err;
      }
    },
    []
  );

  /**
   * 標記單個為已讀
   */
  const markOneAsRead = useCallback(
    async (notificationId: string) => {
      try {
        const response = await notificationService.markOneAsRead(notificationId);

        // 更新本地狀態
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(response.unreadCount);

        return response;
      } catch (err) {
        console.error('標記已讀失敗:', err);
        throw err;
      }
    },
    []
  );

  /**
   * 標記全部為已讀
   */
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await notificationService.markAllAsRead();

      // 更新本地狀態
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);

      return response;
    } catch (err) {
      console.error('標記全部已讀失敗:', err);
      throw err;
    }
  }, []);

  /**
   * 刪除通知
   */
  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        await notificationService.deleteNotification(notificationId);

        // 更新本地狀態
        setNotifications(prev => {
          const filtered = prev.filter(n => n.id !== notificationId);
          return filtered;
        });

        // 重新計算未讀數
        const deletedNotification = notifications.find(n => n.id === notificationId);
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      } catch (err) {
        console.error('刪除通知失敗:', err);
        throw err;
      }
    },
    [notifications]
  );

  /**
   * 清除全部通知
   */
  const clearAll = useCallback(async () => {
    try {
      await notificationService.clearAll();

      // 更新本地狀態
      setNotifications([]);
      setUnreadCount(0);
      setHasMore(false);
    } catch (err) {
      console.error('清除全部通知失敗:', err);
      throw err;
    }
  }, []);

  return {
    notifications,
    isLoading,
    isRefreshing,
    error,
    unreadCount,
    hasMore,
    refresh,
    loadMore,
    markAsRead,
    markOneAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };
};
