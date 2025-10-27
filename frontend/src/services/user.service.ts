import { User, UpdateProfileData } from '../types/auth';
import { Post } from '../types/post';
import { appConfig } from '../config/app.config';
import { userApiService } from './user.api';
import { userMockService } from './user.mock';

/**
 * 用戶服務統一接口
 * 根據配置自動選擇使用 API 或 Mock 服務
 */
const getService = () => {
  return appConfig.dev.useDummyData ? userMockService : userApiService;
};

/**
 * 獲取用戶個人資料
 */
export const getUserProfile = async (userId: string): Promise<User> => {
  return await getService().getUserProfile(userId);
};

/**
 * 更新用戶個人資料
 */
export const updateUserProfile = async (
  userId: string,
  data: UpdateProfileData
): Promise<User> => {
  return await getService().updateUserProfile(userId, data);
};

/**
 * 獲取用戶發布的文章列表
 */
export const getUserPosts = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ posts: Post[]; hasMore: boolean; total: number }> => {
  return await getService().getUserPosts(userId, page, limit);
};

/**
 * 上傳用戶頭像
 */
export const uploadAvatar = async (userId: string, imageUri: string): Promise<string> => {
  return await getService().uploadAvatar(userId, imageUri);
};
