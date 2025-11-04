import { Author } from './post';

/**
 * 關注關係
 */
export interface Follow {
  id: string;
  followerId: string; // 關注者 ID
  followingId: string; // 被關注者 ID
  createdAt: string;
}

/**
 * 關注統計
 */
export interface FollowStats {
  followersCount: number; // 粉絲數
  followingCount: number; // 關注數
  mutualCount?: number; // 共同好友數（可選）
}

/**
 * 關注列表中的用戶
 */
export interface FollowUser {
  id: string;
  username: string;
  avatar?: string | null;
  bio?: string; // 個人簡介
  isFollowing: boolean; // 當前用戶是否關注此用戶
  isFollower: boolean; // 此用戶是否關注當前用戶
  isMutual: boolean; // 是否互相關注
  followedAt?: string; // 關注時間
}

/**
 * 關注列表響應
 */
export interface FollowListResponse {
  users: FollowUser[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
    total: number;
  };
}

/**
 * 關注列表查詢參數
 */
export interface FollowListParams {
  userId: string;
  type: 'followers' | 'following' | 'mutual'; // 列表類型
  page: number;
  limit: number;
}

/**
 * 關注操作響應
 */
export interface FollowActionResponse {
  success: boolean;
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
}

/**
 * 擴展的用戶信息（包含關注狀態）
 */
export interface UserWithFollowStatus extends Author {
  bio?: string;
  followStats: FollowStats;
  isFollowing: boolean; // 當前用戶是否關注此用戶
  isFollower: boolean; // 此用戶是否關注當前用戶
  isMutual: boolean; // 是否互相關注
}
