// HAPPY SHARE - 搜尋引擎接口定義
// 定義統一的搜尋接口，支持未來切換到不同的搜尋引擎（PostgreSQL → Elasticsearch）

export interface SearchParams {
  query: string;
  page: number;
  limit: number;
  sort?: string;
  filters?: Record<string, any>;
}

export interface SearchResult {
  items: any[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface Suggestion {
  text: string;
  type: 'tag' | 'user' | 'post';
  avatar?: string;
  count?: number;
}

/**
 * 搜尋引擎接口
 * 所有搜尋引擎實現（PostgreSQL, Elasticsearch 等）都必須實現此接口
 */
export interface ISearchEngine {
  // ===== 索引操作 =====
  /**
   * 索引單篇文章（添加到搜尋引擎）
   */
  indexPost(postId: string): Promise<void>;

  /**
   * 更新文章索引
   */
  updatePost(postId: string): Promise<void>;

  /**
   * 刪除文章索引
   */
  deletePost(postId: string): Promise<void>;

  /**
   * 批量索引文章
   */
  bulkIndexPosts(postIds: string[]): Promise<void>;

  // ===== 搜尋操作 =====
  /**
   * 搜尋文章
   */
  searchPosts(params: SearchParams): Promise<SearchResult>;

  /**
   * 搜尋用戶
   */
  searchUsers(params: SearchParams): Promise<SearchResult>;

  /**
   * 搜尋文件
   */
  searchFiles(params: SearchParams): Promise<SearchResult>;

  /**
   * 搜尋標籤
   */
  searchTags(params: SearchParams): Promise<SearchResult>;

  /**
   * 獲取搜尋建議（自動完成）
   */
  getSuggestions(query: string): Promise<Suggestion[]>;
}
