import { apiClient } from './api.client';
import type {
  FollowListResponse,
  FollowListParams,
  FollowActionResponse,
  FollowStats,
} from '../types/follow';

/**
 * 關注系統 API 服務
 */
export const followApi = {
  /**
   * 關注用戶
   */
  followUser: async (userId: string): Promise<FollowActionResponse> => {
    const response = await apiClient.post(`/users/${userId}/follow`);
    return response.data;
  },

  /**
   * 取消關注用戶
   */
  unfollowUser: async (userId: string): Promise<FollowActionResponse> => {
    const response = await apiClient.delete(`/users/${userId}/follow`);
    return response.data;
  },

  /**
   * 獲取關注統計
   */
  getFollowStats: async (userId: string): Promise<FollowStats> => {
    const response = await apiClient.get(`/users/${userId}/follow/stats`);
    return response.data;
  },

  /**
   * 檢查關注狀態
   */
  checkFollowStatus: async (userId: string): Promise<{
    isFollowing: boolean;
    isFollower: boolean;
    isMutual: boolean;
  }> => {
    const response = await apiClient.get(`/users/${userId}/follow/status`);
    return response.data;
  },

  /**
   * 獲取粉絲列表
   */
  getFollowers: async (params: Omit<FollowListParams, 'type'>): Promise<FollowListResponse> => {
    const response = await apiClient.get(`/users/${params.userId}/followers`, {
      params: {
        page: params.page,
        limit: params.limit,
      },
    });
    return response.data;
  },

  /**
   * 獲取關注列表
   */
  getFollowing: async (params: Omit<FollowListParams, 'type'>): Promise<FollowListResponse> => {
    const response = await apiClient.get(`/users/${params.userId}/following`, {
      params: {
        page: params.page,
        limit: params.limit,
      },
    });
    return response.data;
  },

  /**
   * 獲取共同好友列表
   */
  getMutualFollows: async (params: Omit<FollowListParams, 'type'>): Promise<FollowListResponse> => {
    const response = await apiClient.get(`/users/${params.userId}/mutual`, {
      params: {
        page: params.page,
        limit: params.limit,
      },
    });
    return response.data;
  },

  /**
   * 獲取關注用戶的文章動態
   */
  getFollowingFeed: async (params: { page: number; limit: number }) => {
    const response = await apiClient.get('/posts/following', {
      params,
    });
    return response.data;
  },
};
