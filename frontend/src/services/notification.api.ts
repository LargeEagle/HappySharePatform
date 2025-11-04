import { apiClient } from './api.client';
import type {
  NotificationListResponse,
  NotificationQueryParams,
  NotificationSettings,
  NotificationStats,
  MarkReadRequest,
  MarkReadResponse,
} from '../types/notification';

/**
 * 通知系統 API 服務
 */
export const notificationApi = {
  /**
   * 獲取通知列表
   */
  getNotifications: async (params: NotificationQueryParams): Promise<NotificationListResponse> => {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  },

  /**
   * 獲取未讀數量
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get('/notifications/unread/count');
    return response.data.count;
  },

  /**
   * 獲取通知統計
   */
  getStats: async (): Promise<NotificationStats> => {
    const response = await apiClient.get('/notifications/stats');
    return response.data;
  },

  /**
   * 標記為已讀
   */
  markAsRead: async (request: MarkReadRequest): Promise<MarkReadResponse> => {
    const response = await apiClient.post('/notifications/read', request);
    return response.data;
  },

  /**
   * 標記單個為已讀
   */
  markOneAsRead: async (notificationId: string): Promise<MarkReadResponse> => {
    const response = await apiClient.post(`/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * 標記全部為已讀
   */
  markAllAsRead: async (): Promise<MarkReadResponse> => {
    const response = await apiClient.post('/notifications/read/all');
    return response.data;
  },

  /**
   * 刪除通知
   */
  deleteNotification: async (notificationId: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  /**
   * 清除所有通知
   */
  clearAll: async (): Promise<{ success: boolean }> => {
    const response = await apiClient.delete('/notifications/all');
    return response.data;
  },

  /**
   * 獲取通知設定
   */
  getSettings: async (): Promise<NotificationSettings> => {
    const response = await apiClient.get('/notifications/settings');
    return response.data;
  },

  /**
   * 更新通知設定
   */
  updateSettings: async (settings: Partial<NotificationSettings>): Promise<NotificationSettings> => {
    const response = await apiClient.put('/notifications/settings', settings);
    return response.data;
  },
};
