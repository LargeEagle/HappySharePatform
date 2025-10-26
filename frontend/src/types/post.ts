export interface Author {
  id: string;
  username: string;
  avatar?: string;
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
  tags?: string[];
  isLiked?: boolean;
  isBookmarked?: boolean;
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