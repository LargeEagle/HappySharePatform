import { apiClient } from './api.client';
import { User, UpdateProfileData } from '../types/auth';
import { Post } from '../types/post';

/**
 * 後端 API 響應格式
 */
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * 用戶服務 - 真實 API 實現
 */
export const userApiService = {
  /**
   * 獲取用戶個人資料
   */
  async getUserProfile(userId: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<{ user: User }>>(`/api/users/${userId}`);
    return response.data.user;
  },

  /**
   * 更新用戶個人資料
   */
  async updateUserProfile(userId: string, data: UpdateProfileData): Promise<User> {
    const response = await apiClient.put<ApiResponse<{ user: User }>>(`/api/users/${userId}`, data);
    return response.data.user;
  },

  /**
   * 獲取用戶發布的文章列表
   */
  async getUserPosts(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ posts: Post[]; hasMore: boolean; total: number }> {
    const response = await apiClient.get<ApiResponse<{ posts: Post[]; total: number }>>(`/api/users/${userId}/posts`, {
      params: { page, limit },
    });
    return {
      posts: response.data.posts,
      total: response.data.total,
      hasMore: response.data.posts.length >= limit
    };
  },

  /**
   * 上傳用戶頭像
   */
  async uploadAvatar(userId: string, imageUri: string): Promise<string> {
    // 暫時使用 URL 上傳（後端簡化版）
    const response = await apiClient.post<ApiResponse<{ avatar: string }>>(
      `/api/users/avatar`,
      { avatarUrl: imageUri }
    );

    return response.data.avatar;
  },
};
