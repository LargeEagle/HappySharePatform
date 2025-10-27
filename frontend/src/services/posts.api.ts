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
    const response = await apiClient.post<ApiResponse<{ post: Post }>>('/api/posts', params);
    return response.data.post;
  },

  /**
   * 更新文章
   */
  async updatePost(id: string, params: Partial<CreatePostParams>): Promise<Post> {
    const response = await apiClient.put<ApiResponse<{ post: Post }>>(`/api/posts/${id}`, params);
    return response.data.post;
  },

  /**
   * 刪除文章
   */
  async deletePost(id: string): Promise<void> {
    await apiClient.delete(`/api/posts/${id}`);
  },

  /**
   * 獲取文章列表
   */
  async getPosts(params?: PostsQueryParams): Promise<PostsResponse> {
    const response = await apiClient.get<ApiResponse<{ posts: Post[]; pagination: any }>>('/api/posts', { params });
    return {
      posts: response.data.posts,
      pagination: response.data.pagination || {
        page: 1,
        limit: 10,
        total: response.data.posts.length,
        pages: 1
      }
    };
  },

  /**
   * 獲取單篇文章
   */
  async getPost(id: string): Promise<Post> {
    const response = await apiClient.get<ApiResponse<{ post: Post }>>(`/api/posts/${id}`);
    return response.data.post;
  },

  /**
   * 切換點讚狀態
   */
  async toggleLike(id: string): Promise<Post> {
    const response = await apiClient.post<ApiResponse<{ isLiked: boolean; likesCount: number }>>(`/api/posts/${id}/like`);
    // 這裡返回的數據不完整，需要重新獲取文章
    return await this.getPost(id);
  },

  /**
   * 切換收藏狀態
   */
  async toggleBookmark(id: string): Promise<Post> {
    const response = await apiClient.post<ApiResponse<{ isBookmarked: boolean; bookmarksCount: number }>>(`/api/posts/${id}/bookmark`);
    // 這裡返回的數據不完整，需要重新獲取文章
    return await this.getPost(id);
  },
};
