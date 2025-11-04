import type {
  FollowListResponse,
  FollowListParams,
  FollowActionResponse,
  FollowStats,
  FollowUser,
} from '../types/follow';

// 模擬用戶數據
const mockUsers: FollowUser[] = [
  {
    id: '2',
    username: 'alice_wang',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: '熱愛旅行和攝影 🌍📷',
    isFollowing: true,
    isFollower: true,
    isMutual: true,
    followedAt: '2024-10-15T08:30:00Z',
  },
  {
    id: '3',
    username: 'bob_chen',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: '軟體工程師 | 程式愛好者 💻',
    isFollowing: true,
    isFollower: false,
    isMutual: false,
    followedAt: '2024-10-20T14:20:00Z',
  },
  {
    id: '4',
    username: 'carol_lee',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: '美食探索家 🍜',
    isFollowing: false,
    isFollower: true,
    isMutual: false,
    followedAt: '2024-11-01T10:15:00Z',
  },
  {
    id: '5',
    username: 'david_liu',
    avatar: 'https://i.pravatar.cc/150?img=4',
    bio: '設計師 | UI/UX 專家 🎨',
    isFollowing: true,
    isFollower: true,
    isMutual: true,
    followedAt: '2024-09-10T16:45:00Z',
  },
  {
    id: '6',
    username: 'emma_huang',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: '健身愛好者 💪',
    isFollowing: true,
    isFollower: false,
    isMutual: false,
    followedAt: '2024-10-25T09:00:00Z',
  },
  {
    id: '7',
    username: 'frank_zhang',
    avatar: 'https://i.pravatar.cc/150?img=6',
    bio: '音樂製作人 🎵',
    isFollowing: false,
    isFollower: true,
    isMutual: false,
    followedAt: '2024-10-18T13:30:00Z',
  },
  {
    id: '8',
    username: 'grace_wu',
    avatar: 'https://i.pravatar.cc/150?img=7',
    bio: '作家 | 文字工作者 ✍️',
    isFollowing: true,
    isFollower: true,
    isMutual: true,
    followedAt: '2024-08-22T11:20:00Z',
  },
  {
    id: '9',
    username: 'henry_lin',
    avatar: 'https://i.pravatar.cc/150?img=8',
    bio: '創業者 | 科技愛好者 🚀',
    isFollowing: true,
    isFollower: false,
    isMutual: false,
    followedAt: '2024-11-02T15:10:00Z',
  },
];

// 模擬關注狀態
const followStatus = new Map<string, boolean>();

// 初始化關注狀態
mockUsers.forEach(user => {
  followStatus.set(user.id, user.isFollowing);
});

/**
 * 延遲函數（模擬網絡請求）
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock 關注系統服務
 */
export const followMockService = {
  /**
   * 關注用戶
   */
  followUser: async (userId: string): Promise<FollowActionResponse> => {
    await delay(500);
    
    followStatus.set(userId, true);
    
    // 更新 mockUsers 中的狀態
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.isFollowing = true;
      user.followedAt = new Date().toISOString();
    }
    
    return {
      success: true,
      isFollowing: true,
      followersCount: mockUsers.filter(u => u.isFollower).length,
      followingCount: mockUsers.filter(u => u.isFollowing).length + 1,
    };
  },

  /**
   * 取消關注用戶
   */
  unfollowUser: async (userId: string): Promise<FollowActionResponse> => {
    await delay(500);
    
    followStatus.set(userId, false);
    
    // 更新 mockUsers 中的狀態
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.isFollowing = false;
      user.followedAt = undefined;
    }
    
    return {
      success: true,
      isFollowing: false,
      followersCount: mockUsers.filter(u => u.isFollower).length,
      followingCount: Math.max(0, mockUsers.filter(u => u.isFollowing).length - 1),
    };
  },

  /**
   * 獲取關注統計
   */
  getFollowStats: async (userId: string): Promise<FollowStats> => {
    await delay(300);
    
    return {
      followersCount: mockUsers.filter(u => u.isFollower).length,
      followingCount: mockUsers.filter(u => u.isFollowing).length,
      mutualCount: mockUsers.filter(u => u.isMutual).length,
    };
  },

  /**
   * 檢查關注狀態
   */
  checkFollowStatus: async (userId: string): Promise<{
    isFollowing: boolean;
    isFollower: boolean;
    isMutual: boolean;
  }> => {
    await delay(200);
    
    const user = mockUsers.find(u => u.id === userId);
    
    return {
      isFollowing: followStatus.get(userId) || false,
      isFollower: user?.isFollower || false,
      isMutual: user?.isMutual || false,
    };
  },

  /**
   * 獲取粉絲列表
   */
  getFollowers: async (params: Omit<FollowListParams, 'type'>): Promise<FollowListResponse> => {
    await delay(500);
    
    const followers = mockUsers.filter(u => u.isFollower);
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;
    const paginatedUsers = followers.slice(start, end);
    
    return {
      users: paginatedUsers,
      pagination: {
        currentPage: params.page,
        totalPages: Math.ceil(followers.length / params.limit),
        hasMore: end < followers.length,
        total: followers.length,
      },
    };
  },

  /**
   * 獲取關注列表
   */
  getFollowing: async (params: Omit<FollowListParams, 'type'>): Promise<FollowListResponse> => {
    await delay(500);
    
    const following = mockUsers.filter(u => u.isFollowing);
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;
    const paginatedUsers = following.slice(start, end);
    
    return {
      users: paginatedUsers,
      pagination: {
        currentPage: params.page,
        totalPages: Math.ceil(following.length / params.limit),
        hasMore: end < following.length,
        total: following.length,
      },
    };
  },

  /**
   * 獲取共同好友列表
   */
  getMutualFollows: async (params: Omit<FollowListParams, 'type'>): Promise<FollowListResponse> => {
    await delay(500);
    
    const mutual = mockUsers.filter(u => u.isMutual);
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;
    const paginatedUsers = mutual.slice(start, end);
    
    return {
      users: paginatedUsers,
      pagination: {
        currentPage: params.page,
        totalPages: Math.ceil(mutual.length / params.limit),
        hasMore: end < mutual.length,
        total: mutual.length,
      },
    };
  },

  /**
   * 獲取關注用戶的文章動態
   */
  getFollowingFeed: async (params: { page: number; limit: number }) => {
    await delay(800);
    
    // 這裡可以返回關注用戶的文章
    // 暫時返回空數組，實際應該從 posts.mock.ts 中篩選
    return {
      posts: [],
      pagination: {
        currentPage: params.page,
        totalPages: 0,
        hasMore: false,
      },
    };
  },
};
