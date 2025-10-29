import { User, UpdateProfileData } from '../types/auth';
import { Post } from '../types/post';
import { dummyUsers, dummyPosts, delay } from '../utils/dummyData';

/**
 * 用戶服務 - Mock 實現
 */

// 複製一份可變的用戶數據
let mockUsers = { ...dummyUsers };

export const userMockService = {
  /**
   * 獲取用戶個人資料
   */
  async getUserProfile(userId: string): Promise<User> {
    await delay();
    const user = mockUsers[userId] || mockUsers['1'];
    return user;
  },

  /**
   * 更新用戶個人資料
   */
  async updateUserProfile(userId: string, data: UpdateProfileData): Promise<User> {
    await delay();
    const user = mockUsers[userId] || mockUsers['1'];
    const updatedUser = {
      ...user,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    mockUsers[userId] = updatedUser;
    return updatedUser;
  },

  /**
   * 獲取用戶發布的文章列表
   */
  async getUserPosts(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ posts: Post[]; hasMore: boolean; total: number }> {
    await delay();
    
    // 過濾出該用戶的文章
    const userPosts = dummyPosts.filter(post => post.author.id === userId);
    const start = (page - 1) * limit;
    const end = start + limit;
    const posts = userPosts.slice(start, end);
    
    return {
      posts,
      hasMore: end < userPosts.length,
      total: userPosts.length,
    };
  },

  /**
   * 上傳用戶頭像
   */
  async uploadAvatar(userId: string, imageUri: string): Promise<string> {
    await delay(1000);
    // 返回一個隨機頭像 URL
    const avatarUrl = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`;
    
    // 更新用戶頭像
    if (mockUsers[userId]) {
      mockUsers[userId] = {
        ...mockUsers[userId],
        avatar: avatarUrl,
        updatedAt: new Date().toISOString(),
      };
    }
    
    return avatarUrl;
  },

  /**
   * 重置 mock 數據（用於測試）
   */
  resetMockData(): void {
    mockUsers = { ...dummyUsers };
  },
};
