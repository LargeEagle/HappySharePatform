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
  sort: 'latest' | 'popular';
}

export interface CreatePostParams {
  title: string;
  content: string;
  tags?: string[];
  images?: string[];
}