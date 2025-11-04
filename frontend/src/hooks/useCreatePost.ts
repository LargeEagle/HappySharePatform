import { useState, useCallback } from 'react';
import { CreatePostParams } from '../types/post';
import { postsService } from '../services/posts.service';

export function useCreatePost() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = useCallback(async (params: CreatePostParams) => {
    try {
      setIsCreating(true);
      setError(null);
      const newPost = await postsService.createPost(params);
      return newPost;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '創建文章失敗';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createPost,
    isCreating,
    error,
    resetError
  };
}
