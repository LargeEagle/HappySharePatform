import { Post, PostsQueryParams, PostsResponse, CreatePostParams } from '../types/post';
import { dummyPosts, delay } from '../utils/dummyData';
import { 
  filterPostsByRadius, 
  sortPostsByDistance 
} from '../utils/location';

/**
 * 文章服務 - Mock 實現
 * 用於開發環境，使用模擬數據
 */

// 模擬文章數據
let mockPosts: Post[] = [...dummyPosts];

export const postsMockService = {
  /**
   * 創建新文章
   */
  async createPost(params: CreatePostParams): Promise<Post> {
    await delay();

    const newPost: Post = {
      id: String(mockPosts.length + 1),
      ...params,
      author: {
        id: '1',
        username: 'TestUser',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isLiked: false,
      isBookmarked: false,
      isPublished: true
    };

    mockPosts.unshift(newPost);
    return newPost;
  },

  /**
   * 更新文章
   */
  async updatePost(id: string, params: Partial<CreatePostParams>): Promise<Post> {
    await delay();

    const index = mockPosts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('文章不存在');
    }

    mockPosts[index] = {
      ...mockPosts[index],
      ...params,
      updatedAt: new Date().toISOString()
    };

    return mockPosts[index];
  },

  /**
   * 刪除文章
   */
  async deletePost(id: string): Promise<void> {
    await delay();

    const index = mockPosts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('文章不存在');
    }

    mockPosts.splice(index, 1);
  },

  /**
   * 獲取文章列表
   */
  async getPosts(params?: PostsQueryParams): Promise<PostsResponse> {
    await delay();

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const sort = params?.sort || 'latest';
    const location = params?.location;

    let filteredPosts = [...mockPosts];

    // 位置篩選
    if (location) {
      const radiusKm = location.radiusKm || 10; // 預設 10km
      filteredPosts = filterPostsByRadius(
        filteredPosts,
        { latitude: location.latitude, longitude: location.longitude },
        radiusKm
      );
    }

    // 排序
    if (sort === 'nearest' && location) {
      filteredPosts = sortPostsByDistance(
        filteredPosts,
        { latitude: location.latitude, longitude: location.longitude }
      );
    } else if (sort === 'popular') {
      filteredPosts.sort((a, b) => b.likes - a.likes);
    }
    // 'latest' 已經是預設順序（新的在前）

    const start = (page - 1) * limit;
    const end = start + limit;
    const posts = filteredPosts.slice(start, end);
    const totalPages = Math.ceil(filteredPosts.length / limit);

    return {
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        hasMore: page < totalPages
      }
    };
  },

  /**
   * 獲取單篇文章
   */
  async getPost(id: string): Promise<Post> {
    await delay();

    const post = mockPosts.find(p => p.id === id);
    if (!post) {
      throw new Error('文章不存在');
    }

    return post;
  },

  /**
   * 切換點讚狀態
   */
  async toggleLike(id: string): Promise<Post> {
    await delay();

    const index = mockPosts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('文章不存在');
    }

    const post = mockPosts[index];
    const isLiked = !post.isLiked;
    
    mockPosts[index] = {
      ...post,
      isLiked,
      likes: isLiked ? post.likes + 1 : post.likes - 1
    };

    return mockPosts[index];
  },

  /**
   * 切換收藏狀態
   */
  async toggleBookmark(id: string): Promise<Post> {
    await delay();

    const index = mockPosts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('文章不存在');
    }

    mockPosts[index] = {
      ...mockPosts[index],
      isBookmarked: !mockPosts[index].isBookmarked
    };

    return mockPosts[index];
  },

  /**
   * 重置 mock 數據（用於測試）
   */
  resetMockData(): void {
    mockPosts = [...dummyPosts];
  }
};
