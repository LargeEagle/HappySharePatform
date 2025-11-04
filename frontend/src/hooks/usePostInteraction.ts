import { useState, useCallback } from 'react';
import { postInteractionService } from '../services/postInteraction.service';
import type { Comment } from '../services/postInteraction.service';

interface UsePostInteractionProps {
  postId: string;
}

interface UsePostInteractionReturn {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  loadMoreComments: () => Promise<void>;
  refreshComments: () => Promise<void>;
  createComment: (content: string) => Promise<void>;
  toggleCommentLike: (commentId: string) => Promise<void>;
  togglePostLike: () => Promise<void>;
  toggleBookmark: () => Promise<void>;
}

export function usePostInteraction({ postId }: UsePostInteractionProps): UsePostInteractionReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 載入評論
  const loadComments = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await postInteractionService.getComments(postId, page);
      
      if (page === 1) {
        setComments(response.comments);
      } else {
        setComments(prev => [...prev, ...response.comments]);
      }
      
      setHasMore(response.pagination.hasMore);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入評論失敗');
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  // 載入更多評論
  const loadMoreComments = useCallback(async () => {
    if (!isLoading && hasMore) {
      await loadComments(currentPage + 1);
    }
  }, [currentPage, hasMore, isLoading, loadComments]);

  // 重新整理評論
  const refreshComments = useCallback(async () => {
    await loadComments(1);
  }, [loadComments]);

  // 發表評論
  const createComment = useCallback(async (content: string, parentId?: string, replyToUsername?: string) => {
    try {
      setError(null);
      await postInteractionService.createComment({ 
        postId, 
        content,
        parentId,
        replyToUserId: parentId, // 使用 parentId 作為 replyToUserId
        replyToUsername
      });
      await refreshComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : '發表評論失敗');
      throw err;
    }
  }, [postId, refreshComments]);

  // 點讚評論
  const toggleCommentLike = useCallback(async (commentId: string) => {
    try {
      setError(null);
      await postInteractionService.toggleCommentLike(postId, commentId);
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                isLiked: !comment.isLiked,
                likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
              }
            : comment
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失敗');
      throw err;
    }
  }, [postId]);

  // 點讚文章
  const togglePostLike = useCallback(async () => {
    try {
      setError(null);
      await postInteractionService.toggleLike(postId);
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失敗');
      throw err;
    }
  }, [postId]);

  // 收藏文章
  const toggleBookmark = useCallback(async () => {
    try {
      setError(null);
      await postInteractionService.toggleBookmark(postId);
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失敗');
      throw err;
    }
  }, [postId]);

  return {
    comments,
    isLoading,
    error,
    hasMore,
    currentPage,
    loadMoreComments,
    refreshComments,
    createComment,
    toggleCommentLike,
    togglePostLike,
    toggleBookmark
  };
}