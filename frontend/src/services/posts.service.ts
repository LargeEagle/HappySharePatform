import { Post, PostsQueryParams, PostsResponse, CreatePostParams } from '../types/post';
import { appConfig } from '../config/app.config';
import { dummyPosts, delay } from '../utils/dummyData';

// 模擬文章數據（開發用）
const mockPosts: Post[] = [...dummyPosts];

export const postsService = {
  async createPost(params: CreatePostParams): Promise<Post> {
    // 模擬 API 延遲
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

  async updatePost(id: string, params: Partial<CreatePostParams>): Promise<Post> {
    // 模擬 API 延遲
    await delay();

    const index = mockPosts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('找不到文章');
    }

    const updatedPost: Post = {
      ...mockPosts[index],
      ...params,
      updatedAt: new Date().toISOString()
    };

    mockPosts[index] = updatedPost;
    return updatedPost;
  },

  async deletePost(id: string): Promise<void> {
    // 模擬 API 延遲
    await new Promise(resolve => setTimeout(resolve, 1000));

    const index = mockPosts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('找不到文章');
    }

    mockPosts.splice(index, 1);
  },

  async togglePublishPost(id: string): Promise<Post> {
    // 模擬 API 延遲
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = mockPosts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('找不到文章');
    }

    const updatedPost: Post = {
      ...mockPosts[index],
      isPublished: !mockPosts[index].isPublished,
      updatedAt: new Date().toISOString()
    };

    mockPosts[index] = updatedPost;
    return updatedPost;
  },

  async getPost(id: string): Promise<Post> {
    // 模擬API延遲
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const post = mockPosts.find(p => p.id === id);
    if (!post) {
      throw new Error('找不到文章');
    }
    
    return post;
  },

  async getPosts(params: PostsQueryParams): Promise<PostsResponse> {
    // 模擬API延遲
    await new Promise(resolve => setTimeout(resolve, 1000));

    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;
    
    // 只顯示已發布的文章
    let filteredPosts = mockPosts.filter(p => p.isPublished !== false);
    
    // 根據排序方式處理數據
    let sortedPosts = [...filteredPosts];
    if (params.sort === 'latest') {
      sortedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (params.sort === 'popular') {
      sortedPosts.sort((a, b) => b.likes - a.likes);
    }

    return {
      posts: sortedPosts.slice(start, end),
      pagination: {
        currentPage: params.page,
        totalPages: Math.ceil(filteredPosts.length / params.limit),
        hasMore: end < filteredPosts.length
      }
    };
  }
};