import { Post } from '../types/post';

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
const mockComments: { [key: string]: Comment[] } = {};

export const postInteractionService = {
  // 點讚文章
  async toggleLike(postId: string): Promise<PostInteractionResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 在實際應用中，這裡會調用後端 API
    return {
      success: true,
      message: '操作成功'
    };
  },

  // 收藏文章
  async toggleBookmark(postId: string): Promise<PostInteractionResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: '操作成功'
    };
  },

  // 獲取文章評論
  async getComments(postId: string, page: number = 1, limit: number = 10) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!mockComments[postId]) {
      mockComments[postId] = Array.from({ length: 20 }, (_, index) => ({
        id: `${postId}-comment-${index + 1}`,
        content: `這是第 ${index + 1} 條評論。分享快樂的時刻！`,
        author: {
          id: String(Math.floor(Math.random() * 1000)),
          username: `User${Math.floor(Math.random() * 1000)}`,
          avatar: null
        },
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        likes: Math.floor(Math.random() * 50),
        isLiked: Math.random() > 0.5
      }));
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const comments = mockComments[postId].slice(start, end);

    return {
      comments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(mockComments[postId].length / limit),
        hasMore: end < mockComments[postId].length
      }
    };
  },

  // 發表評論
  async createComment(params: CreateCommentParams): Promise<PostInteractionResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newComment: Comment = {
      id: `${params.postId}-comment-${Date.now()}`,
      content: params.content,
      author: {
        id: '1', // 應該使用當前登入用戶的ID
        username: 'TestUser',
        avatar: null
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
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: '操作成功'
    };
  }
};