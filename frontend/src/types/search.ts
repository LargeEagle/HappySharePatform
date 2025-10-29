// HAPPY SHARE - 搜尋功能類型定義

import { Post } from './post';
import { User } from './auth';

// 搜尋類型
export type SearchType = 'all' | 'posts' | 'users' | 'files' | 'tags';

// 搜尋參數
export interface SearchParams {
  query: string;
  type?: SearchType;
  sort?: 'relevant' | 'latest' | 'popular' | 'followers' | 'posts';
  page?: number;
  limit?: number;
}

// 標籤
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postsCount: number;
  createdAt: string;
  updatedAt: string;
}

// 附件（文件）
export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
  post: {
    id: string;
    title: string;
  };
  uploader: {
    id: string;
    username: string;
    name: string | null;
  };
}

// 搜尋建議
export interface SearchSuggestion {
  text: string;
  type: 'tag' | 'user';
  avatar?: string;
  count?: number;
}

// 搜尋歷史
export interface SearchHistoryItem {
  query: string;
  type: string;
  createdAt: string;
}

// 分頁信息
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

// 搜尋結果
export interface SearchResult {
  // 綜合搜尋結果
  posts?: Post[];
  users?: User[];
  files?: Attachment[];
  tags?: Tag[];
  
  // 單類型搜尋結果
  query?: string;
  totals?: {
    posts: number;
    users: number;
    files: number;
    tags: number;
  };
  
  // 分頁信息
  pagination?: Pagination;
}

// API 響應包裝
export interface SearchResponse {
  success: boolean;
  message?: string;
  data: SearchResult;
}

export interface TagsResponse {
  success: boolean;
  data: {
    tags: Tag[];
    pagination?: Pagination;
  };
}

export interface TagResponse {
  success: boolean;
  data: {
    tag: Tag;
  };
}

export interface TagPostsResponse {
  success: boolean;
  data: {
    tag: Tag;
    posts: Post[];
    pagination: Pagination;
  };
}

export interface SuggestionsResponse {
  success: boolean;
  data: {
    suggestions: SearchSuggestion[];
  };
}

export interface SearchHistoryResponse {
  success: boolean;
  data: {
    history: SearchHistoryItem[];
  };
}
