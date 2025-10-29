import { useState } from 'react';
import { postsService } from '../services/posts.service';
import { Post, CreatePostParams } from '../types/post';

export function usePostManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePost = async (id: string, params: Partial<CreatePostParams>): Promise<Post | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedPost = await postsService.updatePost(id, params);
      return updatedPost;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新文章失敗';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      await postsService.deletePost(id);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '刪除文章失敗';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const togglePublish = async (id: string): Promise<Post | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedPost = await postsService.togglePublishPost(id);
      return updatedPost;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '切換發布狀態失敗';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updatePost,
    deletePost,
    togglePublish,
    isLoading,
    error
  };
}
