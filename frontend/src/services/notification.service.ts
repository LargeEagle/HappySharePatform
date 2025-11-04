import type {
  Notification,
  NotificationListResponse,
  NotificationQueryParams,
  NotificationSettings,
  NotificationStats,
  MarkReadRequest,
  MarkReadResponse,
} from '../types/notification';
import { notificationApi } from './notification.api';
import { notificationMockService } from './notification.mock';

// 使用 Mock 還是實際 API
const USE_MOCK = true; // 開發時設為 true，上線後設為 false

/**
 * 通知服務層（統一 Mock 和 API）
 */
class NotificationService {
  private getService() {
    return USE_MOCK ? notificationMockService : notificationApi;
  }

  /**
   * 獲取通知列表
   */
  async getNotifications(params?: Partial<NotificationQueryParams>): Promise<NotificationListResponse> {
    const defaultParams: NotificationQueryParams = {
      page: 1,
      limit: 20,
      ...params,
    };

    return this.getService().getNotifications(defaultParams);
  }

  /**
   * 獲取未讀通知數量
   */
  async getUnreadCount(): Promise<number> {
    return this.getService().getUnreadCount();
  }

  /**
   * 獲取通知統計
   */
  async getStats(): Promise<NotificationStats> {
    return this.getService().getStats();
  }

  /**
   * 標記多個通知為已讀
   */
  async markAsRead(notificationIds: string[]): Promise<MarkReadResponse> {
    return this.getService().markAsRead({ notificationIds });
  }

  /**
   * 標記單個通知為已讀
   */
  async markOneAsRead(notificationId: string): Promise<MarkReadResponse> {
    return this.getService().markOneAsRead(notificationId);
  }

  /**
   * 標記全部通知為已讀
   */
  async markAllAsRead(): Promise<MarkReadResponse> {
    return this.getService().markAllAsRead();
  }

  /**
   * 刪除通知
   */
  async deleteNotification(notificationId: string): Promise<{ success: boolean }> {
    return this.getService().deleteNotification(notificationId);
  }

  /**
   * 清除所有通知
   */
  async clearAll(): Promise<{ success: boolean }> {
    return this.getService().clearAll();
  }

  /**
   * 獲取通知設定
   */
  async getSettings(): Promise<NotificationSettings> {
    return this.getService().getSettings();
  }

  /**
   * 更新通知設定
   */
  async updateSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    return this.getService().updateSettings(settings);
  }
}

export const notificationService = new NotificationService();
