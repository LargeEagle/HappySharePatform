import { Post } from '../types/post';
import { appConfig } from '../config/app.config';
import { dummyComments, delay } from '../utils/dummyData';

export interface PostInteractionResponse {
  success: boolean;
  message?: string;
  post?: Post;
}

export interface CreateCommentParams {
  postId: string;
  content: string;
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

// 模擬評論數據
const mockComments: { [key: string]: Comment[] } = { ...dummyComments };

export const postInteractionService = {
  // 點讚文章
  async toggleLike(postId: string): Promise<PostInteractionResponse> {
    await delay();
    
    // 在實際應用中，這裡會調用後端 API
    return {
      success: true,
      message: '操作成功'
    };
  },

  // 收藏文章
  async toggleBookmark(postId: string): Promise<PostInteractionResponse> {
    await delay();
    
    return {
      success: true,
      message: '操作成功'
    };
  },

  // 獲取文章評論
  async getComments(postId: string, page: number = 1, limit: number = 10) {
    await delay();
    
    // 如果沒有該文章的評論，返回空數組
    const comments = mockComments[postId] || [];

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedComments = comments.slice(start, end);

    return {
      comments: paginatedComments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(mockComments[postId].length / limit),
        hasMore: end < mockComments[postId].length
      }
    };
  },

  // 發表評論
  async createComment(params: CreateCommentParams): Promise<PostInteractionResponse> {
    await delay();
    
    const newComment: Comment = {
      id: `${params.postId}-comment-${Date.now()}`,
      content: params.content,
      author: {
        id: '1', // 應該使用當前登入用戶的ID
        username: 'TestUser',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    if (!mockComments[params.postId]) {
      mockComments[params.postId] = [];
    }
    
    mockComments[params.postId].unshift(newComment);

    return {
      success: true,
      message: '評論發布成功'
    };
  },

  // 點讚評論
  async toggleCommentLike(postId: string, commentId: string): Promise<PostInteractionResponse> {
    await delay();
    
    return {
      success: true,
      message: '操作成功'
    };
  }
};