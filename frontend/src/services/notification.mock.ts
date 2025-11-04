import type {
  Notification,
  NotificationListResponse,
  NotificationQueryParams,
  NotificationSettings,
  NotificationStats,
  NotificationType,
  MarkReadRequest,
  MarkReadResponse,
} from '../types/notification';

// 模擬通知數據
let mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'follow' as NotificationType,
    title: '新粉絲',
    message: 'alice_wang 開始關注你',
    actor: {
      id: '2',
      username: 'alice_wang',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    targetType: 'user',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5分鐘前
  },
  {
    id: '2',
    type: 'like' as NotificationType,
    title: '新的讚',
    message: 'bob_chen 讚了你的文章「React Native 開發心得」',
    actor: {
      id: '3',
      username: 'bob_chen',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    targetId: 'post1',
    targetType: 'post',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30分鐘前
  },
  {
    id: '3',
    type: 'comment' as NotificationType,
    title: '新評論',
    message: 'carol_lee 評論了你的文章「TypeScript 進階技巧」',
    actor: {
      id: '4',
      username: 'carol_lee',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    targetId: 'post2',
    targetType: 'post',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2小時前
  },
  {
    id: '4',
    type: 'reply' as NotificationType,
    title: '新回覆',
    message: 'david_liu 回覆了你的評論',
    actor: {
      id: '5',
      username: 'david_liu',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    targetId: 'comment1',
    targetType: 'comment',
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5小時前
  },
  {
    id: '5',
    type: 'like' as NotificationType,
    title: '新的讚',
    message: 'emma_huang 讚了你的文章「UI/UX 設計分享」',
    actor: {
      id: '6',
      username: 'emma_huang',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    targetId: 'post3',
    targetType: 'post',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1天前
  },
  {
    id: '6',
    type: 'system' as NotificationType,
    title: '系統公告',
    message: '平台將於今晚 23:00-24:00 進行維護，期間服務可能暫時中斷',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天前
  },
  {
    id: '7',
    type: 'follow' as NotificationType,
    title: '新粉絲',
    message: 'frank_zhang 開始關注你',
    actor: {
      id: '7',
      username: 'frank_zhang',
      avatar: 'https://i.pravatar.cc/150?img=6',
    },
    targetType: 'user',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前
  },
  {
    id: '8',
    type: 'comment' as NotificationType,
    title: '新評論',
    message: 'grace_wu 評論了你的文章「前端性能優化」',
    actor: {
      id: '8',
      username: 'grace_wu',
      avatar: 'https://i.pravatar.cc/150?img=7',
    },
    targetId: 'post4',
    targetType: 'post',
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5天前
  },
];

// 模擬設定
let mockSettings: NotificationSettings = {
  enabled: true,
  follow: true,
  like: true,
  comment: true,
  reply: true,
  mention: true,
  system: true,
  sound: true,
  vibrate: false,
};

/**
 * 延遲函數（模擬網絡請求）
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock 通知系統服務
 */
export const notificationMockService = {
  /**
   * 獲取通知列表
   */
  getNotifications: async (params: NotificationQueryParams): Promise<NotificationListResponse> => {
    await delay(500);

    let filtered = [...mockNotifications];

    // 類型篩選
    if (params.type) {
      filtered = filtered.filter(n => n.type === params.type);
    }

    // 已讀/未讀篩選
    if (params.isRead !== undefined) {
      filtered = filtered.filter(n => n.isRead === params.isRead);
    }

    // 分頁
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;
    const paginatedNotifications = filtered.slice(start, end);

    const unreadCount = mockNotifications.filter(n => !n.isRead).length;

    return {
      notifications: paginatedNotifications,
      unreadCount,
      pagination: {
        currentPage: params.page,
        totalPages: Math.ceil(filtered.length / params.limit),
        hasMore: end < filtered.length,
        total: filtered.length,
      },
    };
  },

  /**
   * 獲取未讀數量
   */
  getUnreadCount: async (): Promise<number> => {
    await delay(200);
    return mockNotifications.filter(n => !n.isRead).length;
  },

  /**
   * 獲取通知統計
   */
  getStats: async (): Promise<NotificationStats> => {
    await delay(300);

    const stats: NotificationStats = {
      total: mockNotifications.length,
      unread: mockNotifications.filter(n => !n.isRead).length,
      byType: {
        follow: mockNotifications.filter(n => n.type === 'follow').length,
        like: mockNotifications.filter(n => n.type === 'like').length,
        comment: mockNotifications.filter(n => n.type === 'comment').length,
        reply: mockNotifications.filter(n => n.type === 'reply').length,
        mention: mockNotifications.filter(n => n.type === 'mention').length,
        system: mockNotifications.filter(n => n.type === 'system').length,
      },
    };

    return stats;
  },

  /**
   * 標記為已讀
   */
  markAsRead: async (request: MarkReadRequest): Promise<MarkReadResponse> => {
    await delay(400);

    let markedCount = 0;
    mockNotifications = mockNotifications.map(n => {
      if (request.notificationIds.includes(n.id) && !n.isRead) {
        markedCount++;
        return { ...n, isRead: true };
      }
      return n;
    });

    const unreadCount = mockNotifications.filter(n => !n.isRead).length;

    return {
      success: true,
      markedCount,
      unreadCount,
    };
  },

  /**
   * 標記單個為已讀
   */
  markOneAsRead: async (notificationId: string): Promise<MarkReadResponse> => {
    await delay(300);

    let markedCount = 0;
    mockNotifications = mockNotifications.map(n => {
      if (n.id === notificationId && !n.isRead) {
        markedCount++;
        return { ...n, isRead: true };
      }
      return n;
    });

    const unreadCount = mockNotifications.filter(n => !n.isRead).length;

    return {
      success: true,
      markedCount,
      unreadCount,
    };
  },

  /**
   * 標記全部為已讀
   */
  markAllAsRead: async (): Promise<MarkReadResponse> => {
    await delay(500);

    const markedCount = mockNotifications.filter(n => !n.isRead).length;
    mockNotifications = mockNotifications.map(n => ({ ...n, isRead: true }));

    return {
      success: true,
      markedCount,
      unreadCount: 0,
    };
  },

  /**
   * 刪除通知
   */
  deleteNotification: async (notificationId: string): Promise<{ success: boolean }> => {
    await delay(400);

    mockNotifications = mockNotifications.filter(n => n.id !== notificationId);

    return { success: true };
  },

  /**
   * 清除所有通知
   */
  clearAll: async (): Promise<{ success: boolean }> => {
    await delay(500);

    mockNotifications = [];

    return { success: true };
  },

  /**
   * 獲取通知設定
   */
  getSettings: async (): Promise<NotificationSettings> => {
    await delay(300);
    return { ...mockSettings };
  },

  /**
   * 更新通知設定
   */
  updateSettings: async (settings: Partial<NotificationSettings>): Promise<NotificationSettings> => {
    await delay(400);

    mockSettings = {
      ...mockSettings,
      ...settings,
    };

    return { ...mockSettings };
  },
};
