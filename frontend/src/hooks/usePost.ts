import { useState, useEffect, useCallback } from 'react';
import { Post, CreatePostParams } from '../types/post';
import { postsService } from '../services/posts.service';

export function usePost(postId: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const data = await postsService.getPost(postId);
        if (isMounted) {
          setPost(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : '載入文章失敗');
          setPost(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [postId]);

  const createPost = useCallback(async (params: CreatePostParams) => {
    try {
      setIsLoading(true);
      setError(null);
      const newPost = await postsService.createPost(params);
      return newPost;
    } catch (err) {
      setError(err instanceof Error ? err.message : '創建文章失敗');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    post,
    isLoading,
    error,
    createPost,
  };
}