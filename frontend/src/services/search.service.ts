// HAPPY SHARE - 搜尋服務

import { apiClient } from './api.client';
import type {
  SearchParams,
  SearchResponse,
  SuggestionsResponse,
  SearchHistoryResponse,
} from '../types/search';

/**
 * 搜尋服務
 */
export const searchService = {
  /**
   * 綜合搜尋（所有類型）
   */
  async search(params: SearchParams): Promise<SearchResponse> {
    const response = await apiClient.get<SearchResponse>('/search', { params });
    return response.data;
  },

  /**
   * 搜尋文章
   */
  async searchPosts(params: Omit<SearchParams, 'type'>): Promise<SearchResponse> {
    const response = await apiClient.get<SearchResponse>('/search/posts', { params });
    return response.data;
  },

  /**
   * 搜尋用戶
   */
  async searchUsers(params: Omit<SearchParams, 'type'>): Promise<SearchResponse> {
    const response = await apiClient.get<SearchResponse>('/search/users', { params });
    return response.data;
  },

  /**
   * 搜尋文件
   */
  async searchFiles(params: Omit<SearchParams, 'type'>): Promise<SearchResponse> {
    const response = await apiClient.get<SearchResponse>('/search/files', { params });
    return response.data;
  },

  /**
   * 搜尋標籤
   */
  async searchTags(params: Omit<SearchParams, 'type'>): Promise<SearchResponse> {
    const response = await apiClient.get<SearchResponse>('/search/tags', { params });
    return response.data;
  },

  /**
   * 獲取搜尋建議（自動完成）
   */
  async getSuggestions(query: string): Promise<SuggestionsResponse> {
    if (query.length < 2) {
      return {
        success: true,
        data: { suggestions: [] },
      };
    }
    const response = await apiClient.get<SuggestionsResponse>('/search/suggestions', {
      params: { q: query },
    });
    return response.data;
  },

  /**
   * 獲取搜尋歷史
   */
  async getHistory(): Promise<SearchHistoryResponse> {
    const response = await apiClient.get<SearchHistoryResponse>('/search/history');
    return response.data;
  },
};
