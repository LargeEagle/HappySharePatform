import { apiClient } from './api.client';
import { Post, PostsQueryParams, PostsResponse, CreatePostParams } from '../types/post';

/**
 * 文章服務 - 真實 API 實現
 * 用於生產環境，調用真實的後端 API
 */
export const postsApiService = {
  /**
   * 創建新文章
   */
  async createPost(params: CreatePostParams): Promise<Post> {
    return await apiClient.post<Post>('/posts', params);
  },

  /**
   * 更新文章
   */
  async updatePost(id: string, params: Partial<CreatePostParams>): Promise<Post> {
    return await apiClient.put<Post>(`/posts/${id}`, params);
  },

  /**
   * 刪除文章
   */
  async deletePost(id: string): Promise<void> {
    await apiClient.delete(`/posts/${id}`);
  },

  /**
   * 獲取文章列表
   */
  async getPosts(params?: PostsQueryParams): Promise<PostsResponse> {
    return await apiClient.get<PostsResponse>('/posts', { params });
  },

  /**
   * 獲取單篇文章
   */
  async getPost(id: string): Promise<Post> {
    return await apiClient.get<Post>(`/posts/${id}`);
  },

  /**
   * 切換點讚狀態
   */
  async toggleLike(id: string): Promise<Post> {
    return await apiClient.post<Post>(`/posts/${id}/like`);
  },

  /**
   * 切換收藏狀態
   */
  async toggleBookmark(id: string): Promise<Post> {
    return await apiClient.post<Post>(`/posts/${id}/bookmark`);
  },
};
