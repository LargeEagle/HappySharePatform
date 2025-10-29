import { apiClient } from './api.client';
import { Post, PostsQueryParams, PostsResponse, CreatePostParams } from '../types/post';

/**
 * 後端 API 響應格式
 */
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * 文章服務 - 真實 API 實現
 * 用於生產環境，調用真實的後端 API
 */
export const postsApiService = {
  /**
   * 創建新文章
   */
  async createPost(params: CreatePostParams): Promise<Post> {
    const response = await apiClient.post<ApiResponse<Post>>('/posts', params);
    return response.data;
  },

  /**
   * 更新文章
   */
  async updatePost(id: string, params: Partial<CreatePostParams>): Promise<Post> {
    const response = await apiClient.put<ApiResponse<Post>>(`/posts/${id}`, params);
    return response.data;
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
    const response = await apiClient.get<ApiResponse<{ posts: Post[]; pagination: any }>>('/posts', { params });
    return {
      posts: response.data.posts,
      pagination: response.data.pagination || {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: response.data.posts.length,
        pages: 1
      }
    };
  },

  /**
   * 獲取單篇文章
   */
  async getPost(id: string): Promise<Post> {
    const response = await apiClient.get<ApiResponse<Post>>(`/posts/${id}`);
    return response.data;
  },

  /**
   * 切換點讚狀態
   */
  async toggleLike(id: string): Promise<Post> {
    const response = await apiClient.post<ApiResponse<Post>>(`/posts/${id}/like`);
    return response.data;
  },

  /**
   * 切換收藏狀態
   */
  async toggleBookmark(id: string): Promise<Post> {
    const response = await apiClient.post<ApiResponse<Post>>(`/posts/${id}/bookmark`);
    return response.data;
  },
};
