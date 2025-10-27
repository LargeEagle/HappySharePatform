import { Post, PostsQueryParams, PostsResponse, CreatePostParams } from '../types/post';
import { appConfig } from '../config/app.config';
import { postsApiService } from './posts.api';
import { postsMockService } from './posts.mock';

const getService = () => {
  return appConfig.dev.useDummyData ? postsMockService : postsApiService;
};

export const postsService = {
  async createPost(params: CreatePostParams): Promise<Post> {
    return await getService().createPost(params);
  },

  async updatePost(id: string, params: Partial<CreatePostParams>): Promise<Post> {
    return await getService().updatePost(id, params);
  },

  async deletePost(id: string): Promise<void> {
    await getService().deletePost(id);
  },

  async getPosts(params?: PostsQueryParams): Promise<PostsResponse> {
    return await getService().getPosts(params);
  },

  async getPost(id: string): Promise<Post> {
    return await getService().getPost(id);
  },

  async toggleLike(id: string): Promise<Post> {
    return await getService().toggleLike(id);
  },

  async toggleBookmark(id: string): Promise<Post> {
    return await getService().toggleBookmark(id);
  },

  async togglePublishPost(id: string): Promise<Post> {
    // 使用 updatePost，因為這只是更新發布狀態
    const post = await getService().getPost(id);
    return await getService().updatePost(id, {
      isPublished: !post.isPublished
    } as Partial<CreatePostParams>);
  },
};
