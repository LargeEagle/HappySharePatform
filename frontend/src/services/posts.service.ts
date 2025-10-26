import { Post, PostsQueryParams, PostsResponse, CreatePostParams } from '../types/post';

// 模擬文章數據
const mockPosts: Post[] = Array.from({ length: 50 }, (_, index) => ({
  id: String(index + 1),
  title: `測試文章 ${index + 1}`,
  content: `這是測試文章 ${index + 1} 的內容。分享一些快樂的事情...`,
  author: {
    id: '1',
    username: 'Admin',
    avatar: null
  },
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  likes: Math.floor(Math.random() * 100),
  comments: Math.floor(Math.random() * 20),
  tags: ['測試', '快樂', '分享']
}));

export const postsService = {
  async createPost(params: CreatePostParams): Promise<Post> {
    // 模擬 API 延遲
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newPost: Post = {
      id: String(mockPosts.length + 1),
      ...params,
      author: {
        id: '1',
        username: 'TestUser',
        avatar: null
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
    await new Promise(resolve => setTimeout(resolve, 1000));

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