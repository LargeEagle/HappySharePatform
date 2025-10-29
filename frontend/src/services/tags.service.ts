// HAPPY SHARE - 標籤服務

import { apiClient } from './api.client';
import type {
  Tag,
  TagsResponse,
  TagResponse,
  TagPostsResponse,
} from '../types/search';

/**
 * 標籤服務
 */
export const tagsService = {
  /**
   * 獲取所有標籤
   */
  async getTags(params: { page?: number; limit?: number } = {}): Promise<TagsResponse> {
    const response = await apiClient.get<TagsResponse>('/tags', { params });
    return response.data;
  },

  /**
   * 獲取熱門標籤
   */
  async getPopularTags(limit: number = 10): Promise<Tag[]> {
    const response = await apiClient.get<{ success: boolean; data: { tags: Tag[] } }>(
      '/tags/popular',
      { params: { limit } }
    );
    return response.data.data.tags;
  },

  /**
   * 獲取標籤詳情
   */
  async getTag(slug: string): Promise<Tag> {
    const response = await apiClient.get<TagResponse>(`/tags/${slug}`);
    return response.data.data.tag;
  },

  /**
   * 獲取標籤下的文章
   */
  async getTagPosts(params: {
    slug: string;
    page?: number;
    limit?: number;
    sort?: 'latest' | 'popular';
  }): Promise<TagPostsResponse> {
    const { slug, ...queryParams } = params;
    const response = await apiClient.get<TagPostsResponse>(`/tags/${slug}/posts`, {
      params: queryParams,
    });
    return response.data;
  },

  /**
   * 為文章添加標籤
   */
  async addPostTags(postId: string, tags: string[]): Promise<{ success: boolean; data: { tags: Tag[] } }> {
    const response = await apiClient.post<{ success: boolean; data: { tags: Tag[] } }>(
      `/posts/${postId}/tags`,
      { tags }
    );
    return response.data;
  },

  /**
   * 移除文章標籤
   */
  async removePostTag(postId: string, tagId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(
      `/posts/${postId}/tags/${tagId}`
    );
    return response.data;
  },
};
