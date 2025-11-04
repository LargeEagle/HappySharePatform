import type { Tag } from './search';

export interface Author {
  id: string;
  username: string;
  avatar?: string | null;
}

export interface PostTag {
  id: string;
  tag: Tag;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  placeName?: string;
  city?: string;
  country?: string;
  accuracy?: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  images?: string[];
  tags?: string[]; // 舊格式，向後兼容
  postTags?: PostTag[]; // 新格式
  location?: Location; // 新增：位置信息
  isLiked?: boolean;
  isBookmarked?: boolean;
  isPublished?: boolean;
}

export interface PostsResponse {
  posts: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface PostsQueryParams {
  page: number;
  limit: number;
  sort: 'latest' | 'popular' | 'nearest'; // 新增：按距離排序
  // 位置搜尋參數
  location?: {
    latitude: number;
    longitude: number;
    radiusKm?: number; // 搜尋半徑（公里），預設 10km
  };
}

export interface CreatePostParams {
  title: string;
  content: string;
  tags?: string[];
  images?: string[];
  location?: Location; // 新增：位置信息
}