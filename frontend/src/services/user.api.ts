import { apiClient } from './api.client';
import { User, UpdateProfileData } from '../types/auth';
import { Post } from '../types/post';

/**
 * 用戶服務 - 真實 API 實現
 */
export const userApiService = {
  /**
   * 獲取用戶個人資料
   */
  async getUserProfile(userId: string): Promise<User> {
    return await apiClient.get<User>(`/users/${userId}`);
  },

  /**
   * 更新用戶個人資料
   */
  async updateUserProfile(userId: string, data: UpdateProfileData): Promise<User> {
    return await apiClient.put<User>(`/users/${userId}`, data);
  },

  /**
   * 獲取用戶發布的文章列表
   */
  async getUserPosts(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ posts: Post[]; hasMore: boolean; total: number }> {
    return await apiClient.get(`/users/${userId}/posts`, {
      params: { page, limit },
    });
  },

  /**
   * 上傳用戶頭像
   */
  async uploadAvatar(userId: string, imageUri: string): Promise<string> {
    const formData = new FormData();
    
    const filename = imageUri.split('/').pop() || 'avatar.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('avatar', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const response = await apiClient.post<{ avatarUrl: string }>(
      `/users/${userId}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.avatarUrl;
  },
};
