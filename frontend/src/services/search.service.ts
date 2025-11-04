// HAPPY SHARE - 搜尋服務

import { apiClient } from './api.client';
import type {
  SearchParams,
  SearchResponse,
  SearchResult,
  SuggestionsResponse,
  SearchHistoryResponse,
  SearchSuggestion,
  SearchHistoryItem,
} from '../types/search';

/**
 * 搜尋服務
 * 
 * 注意：所有 search* 方法返回 SearchResult（解開後的數據）
 * getSuggestions 和 getHistory 返回完整的 API 響應包裝
 */
export const searchService = {
  /**
   * 綜合搜尋（所有類型）
   */
  async search(params: SearchParams): Promise<SearchResult> {
    // 將 query 轉換為後端期望的 q 參數
    const { query, ...rest } = params;
    const response = await apiClient.get<any>('/search', {
      params: {
        q: query,
        ...rest,
      },
    });
    
    // 解開後端返回的嵌套結構: { success, data: { posts, users, ... } }
    // 返回內層的 data，這樣組件可以直接訪問 response.posts
    return response.data.data;
  },

  /**
   * 搜尋文章
   */
  async searchPosts(params: Omit<SearchParams, 'type'>): Promise<SearchResult> {
    const { query, ...rest } = params;
    const response = await apiClient.get<any>('/search/posts', {
      params: {
        q: query,
        ...rest,
      },
    });
    return response.data.data;
  },

  /**
   * 搜尋用戶
   */
  async searchUsers(params: Omit<SearchParams, 'type'>): Promise<SearchResult> {
    const { query, ...rest } = params;
    const response = await apiClient.get<any>('/search/users', {
      params: {
        q: query,
        ...rest,
      },
    });
    return response.data.data;
  },

  /**
   * 搜尋文件
   */
  async searchFiles(params: Omit<SearchParams, 'type'>): Promise<SearchResult> {
    const { query, ...rest } = params;
    const response = await apiClient.get<any>('/search/files', {
      params: {
        q: query,
        ...rest,
      },
    });
    return response.data.data;
  },

  /**
   * 搜尋標籤
   */
  async searchTags(params: Omit<SearchParams, 'type'>): Promise<SearchResult> {
    const { query, ...rest } = params;
    const response = await apiClient.get<any>('/search/tags', {
      params: {
        q: query,
        ...rest,
      },
    });
    return response.data.data;
  },

  /**
   * 獲取搜尋建議（自動完成）
   */
  async getSuggestions(query: string, signal?: AbortSignal): Promise<SearchSuggestion[]> {
    if (query.length < 2) {
      return [];
    }
    const response = await apiClient.get<any>('/search/suggestions', {
      params: { q: query },
      signal,
    });
    // 解開響應包裝，直接返回 suggestions 數組
    return response.data.data?.suggestions || [];
  },

  /**
   * 獲取搜尋歷史
   */
  async getHistory(): Promise<SearchHistoryItem[]> {
    const response = await apiClient.get<any>('/search/history');
    // 解開響應包裝，直接返回 history 數組
    return response.data.data?.history || [];
  },
};
