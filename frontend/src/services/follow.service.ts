import { followApi } from './follow.api';
import { followMockService } from './follow.mock';
import type {
  FollowListResponse,
  FollowListParams,
  FollowActionResponse,
  FollowStats,
} from '../types/follow';

// 是否使用 Mock 數據
const USE_MOCK = true; // 開發時使用 Mock，生產環境改為 false

/**
 * 關注服務（統一接口）
 */
export const followService = {
  /**
   * 關注用戶
   */
  followUser: async (userId: string): Promise<FollowActionResponse> => {
    if (USE_MOCK) {
      return followMockService.followUser(userId);
    }
    return followApi.followUser(userId);
  },

  /**
   * 取消關注用戶
   */
  unfollowUser: async (userId: string): Promise<FollowActionResponse> => {
    if (USE_MOCK) {
      return followMockService.unfollowUser(userId);
    }
    return followApi.unfollowUser(userId);
  },

  /**
   * 獲取關注統計
   */
  getFollowStats: async (userId: string): Promise<FollowStats> => {
    if (USE_MOCK) {
      return followMockService.getFollowStats(userId);
    }
    return followApi.getFollowStats(userId);
  },

  /**
   * 檢查關注狀態
   */
  checkFollowStatus: async (userId: string) => {
    if (USE_MOCK) {
      return followMockService.checkFollowStatus(userId);
    }
    return followApi.checkFollowStatus(userId);
  },

  /**
   * 獲取粉絲列表
   */
  getFollowers: async (params: Omit<FollowListParams, 'type'>): Promise<FollowListResponse> => {
    if (USE_MOCK) {
      return followMockService.getFollowers(params);
    }
    return followApi.getFollowers(params);
  },

  /**
   * 獲取關注列表
   */
  getFollowing: async (params: Omit<FollowListParams, 'type'>): Promise<FollowListResponse> => {
    if (USE_MOCK) {
      return followMockService.getFollowing(params);
    }
    return followApi.getFollowing(params);
  },

  /**
   * 獲取共同好友列表
   */
  getMutualFollows: async (params: Omit<FollowListParams, 'type'>): Promise<FollowListResponse> => {
    if (USE_MOCK) {
      return followMockService.getMutualFollows(params);
    }
    return followApi.getMutualFollows(params);
  },

  /**
   * 獲取關注用戶的文章動態
   */
  getFollowingFeed: async (params: { page: number; limit: number }) => {
    if (USE_MOCK) {
      return followMockService.getFollowingFeed(params);
    }
    return followApi.getFollowingFeed(params);
  },

  /**
   * 切換關注狀態
   */
  toggleFollow: async (userId: string, currentStatus: boolean): Promise<FollowActionResponse> => {
    if (currentStatus) {
      return followService.unfollowUser(userId);
    } else {
      return followService.followUser(userId);
    }
  },
};
