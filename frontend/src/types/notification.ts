import { Author } from './post';

/**
 * 通知類型
 */
export enum NotificationType {
  FOLLOW = 'follow',           // 關注通知
  LIKE = 'like',               // 點讚通知
  COMMENT = 'comment',         // 評論通知
  REPLY = 'reply',             // 回覆通知
  MENTION = 'mention',         // 提及通知
  SYSTEM = 'system',           // 系統通知
}

/**
 * 通知接口
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  actor?: Author;              // 觸發通知的用戶
  targetId?: string;           // 目標 ID（文章/評論等）
  targetType?: 'post' | 'comment' | 'user';
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;  // 額外數據
}

/**
 * 通知列表響應
 */
export interface NotificationListResponse {
  notifications: Notification[];
  unreadCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
    total: number;
  };
}

/**
 * 通知查詢參數
 */
export interface NotificationQueryParams {
  page: number;
  limit: number;
  type?: NotificationType;     // 篩選類型
  isRead?: boolean;            // 篩選已讀/未讀
}

/**
 * 通知設定
 */
export interface NotificationSettings {
  enabled: boolean;            // 總開關
  follow: boolean;             // 關注通知
  like: boolean;               // 點讚通知
  comment: boolean;            // 評論通知
  reply: boolean;              // 回覆通知
  mention: boolean;            // 提及通知
  system: boolean;             // 系統通知
  sound: boolean;              // 聲音提醒
  vibrate: boolean;            // 震動提醒
}

/**
 * 通知統計
 */
export interface NotificationStats {
  total: number;
  unread: number;
  byType: {
    [key in NotificationType]: number;
  };
}

/**
 * 標記已讀請求
 */
export interface MarkReadRequest {
  notificationIds: string[];
}

/**
 * 標記已讀響應
 */
export interface MarkReadResponse {
  success: boolean;
  markedCount: number;
  unreadCount: number;
}
