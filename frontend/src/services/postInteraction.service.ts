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
  parentId?: string; // 新增：父評論 ID
  replyToUserId?: string; // 新增：回覆的用戶 ID
  replyToUsername?: string; // 新增：回覆的用戶名
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
  parentId?: string; // 新增：父評論 ID，用於嵌套回覆
  replies?: Comment[]; // 新增：子評論列表
  replyTo?: { // 新增：回覆對象信息
    id: string;
    username: string;
  };
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
      isLiked: false,
      parentId: params.parentId,
      replies: [],
      replyTo: params.replyToUserId && params.replyToUsername ? {
        id: params.replyToUserId,
        username: params.replyToUsername
      } : undefined
    };

    if (!mockComments[params.postId]) {
      mockComments[params.postId] = [];
    }
    
    // 如果是回覆，添加到父評論的 replies 中
    if (params.parentId) {
      const parentComment = mockComments[params.postId].find(c => c.id === params.parentId);
      if (parentComment) {
        if (!parentComment.replies) {
          parentComment.replies = [];
        }
        parentComment.replies.push(newComment);
      }
    } else {
      // 頂層評論
      mockComments[params.postId].unshift(newComment);
    }

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