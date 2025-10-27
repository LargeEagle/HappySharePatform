import axios from 'axios';
import { appConfig } from '../config/app.config';
import { User, UpdateProfileData } from '../types/auth';
import { Post } from '../types/post';
import { authStorage } from '../utils/storage';
import { dummyUsers, dummyPosts, delay } from '../utils/dummyData';

/**
 * 獲取用戶個人資料
 */
export const getUserProfile = async (userId: string): Promise<User> => {
  // 開發模式：使用 dummy data
  if (appConfig.dev.useDummyData) {
    await delay();
    const user = dummyUsers[userId] || dummyUsers['1'];
    return user;
  }

  // 生產模式：調用真實 API
  try {
    const auth = await authStorage.getAuth();
    const response = await axios.get(`${appConfig.api.baseUrl}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || '獲取用戶資料失敗');
    }
    throw error;
  }
};

/**
 * 更新用戶個人資料
 */
export const updateUserProfile = async (
  userId: string,
  data: UpdateProfileData
): Promise<User> => {
  // 開發模式：使用 dummy data
  if (appConfig.dev.useDummyData) {
    await delay();
    const user = dummyUsers[userId] || dummyUsers['1'];
    return {
      ...user,
      ...data,
      updatedAt: new Date().toISOString(),
    };
  }

  // 生產模式：調用真實 API
  try {
    const auth = await authStorage.getAuth();
    const response = await axios.put(
      `${appConfig.api.baseUrl}/users/${userId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || '更新用戶資料失敗');
    }
    throw error;
  }
};

/**
 * 獲取用戶發布的文章列表
 */
export const getUserPosts = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ posts: Post[]; hasMore: boolean; total: number }> => {
  // 開發模式：使用 dummy data
  if (appConfig.dev.useDummyData) {
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
  }

  // 生產模式：調用真實 API
  try {
    const auth = await authStorage.getAuth();
    const response = await axios.get(`${appConfig.api.baseUrl}/users/${userId}/posts`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || '獲取用戶文章失敗');
    }
    throw error;
  }
};

/**
 * 上傳用戶頭像
 */
export const uploadAvatar = async (userId: string, imageUri: string): Promise<string> => {
  // 開發模式：模擬上傳
  if (appConfig.dev.useDummyData) {
    await delay(1000);
    // 返回一個隨機頭像 URL
    return `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`;
  }

  // 生產模式：調用真實 API
  try {
    const auth = await authStorage.getAuth();
    const formData = new FormData();
    
    // 處理圖片上傳
    const filename = imageUri.split('/').pop() || 'avatar.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('avatar', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const response = await axios.post(
      `${appConfig.api.baseUrl}/users/${userId}/avatar`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.avatarUrl;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || '上傳頭像失敗');
    }
    throw error;
  }
};
