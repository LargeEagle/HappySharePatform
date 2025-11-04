import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto, PostQueryDto } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(authorId: string, createPostDto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        ...createPostDto,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    // 更新用戶文章計數
    await this.prisma.user.update({
      where: { id: authorId },
      data: { postsCount: { increment: 1 } },
    });

    return {
      success: true,
      message: 'Post created successfully',
      data: {
        ...post,
        isLiked: false,
        isBookmarked: false,
      },
    };
  }

  async getPosts(query: PostQueryDto, currentUserId?: string) {
    const { page = 1, limit = 10, sort = 'latest' } = query;
    const skip = (page - 1) * limit;

    const orderBy = sort === 'popular' 
      ? { likesCount: 'desc' as const }
      : { createdAt: 'desc' as const };

    // 使用 executeWithRetry 包裝查詢
    return await this.prisma.executeWithRetry(async () => {
      const [posts, total] = await Promise.all([
        this.prisma.post.findMany({
          where: { isPublished: true },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        this.prisma.post.count({ where: { isPublished: true } }),
      ]);

      // 如果用戶已登入，批量獲取點讚和收藏狀態（避免 N+1 查詢）
      let postsWithInteractions = posts.map(post => ({
        ...post,
        isLiked: false,
        isBookmarked: false,
      }));

      if (currentUserId && posts.length > 0) {
        const postIds = posts.map(p => p.id);
        
        // 批量查詢，只用 2 個查詢而不是 N*2 個
        const [likes, bookmarks] = await Promise.all([
          this.prisma.like.findMany({
            where: {
              userId: currentUserId,
              postId: { in: postIds },
            },
            select: { postId: true },
          }),
          this.prisma.bookmark.findMany({
            where: {
              userId: currentUserId,
              postId: { in: postIds },
            },
            select: { postId: true },
          }),
        ]);

        const likedPostIds = new Set(likes.map(l => l.postId));
        const bookmarkedPostIds = new Set(bookmarks.map(b => b.postId));

        postsWithInteractions = posts.map(post => ({
          ...post,
          isLiked: likedPostIds.has(post.id),
          isBookmarked: bookmarkedPostIds.has(post.id),
        }));
      }

      return {
        success: true,
        message: 'Posts retrieved successfully',
        data: {
          posts: postsWithInteractions,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            hasMore: page < Math.ceil(total / limit),
            total,
          },
        },
      };
    });
  }

  async getPost(id: string, currentUserId?: string) {
    return await this.prisma.executeWithRetry(async () => {
      const post = await this.prisma.post.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      // 檢查點讚和收藏狀態
      let isLiked = false;
      let isBookmarked = false;

      if (currentUserId) {
        const [like, bookmark] = await Promise.all([
          this.prisma.like.findUnique({
            where: {
              userId_postId: {
                userId: currentUserId,
                postId: id,
              },
            },
          }),
          this.prisma.bookmark.findUnique({
            where: {
              userId_postId: {
                userId: currentUserId,
                postId: id,
              },
            },
          }),
        ]);

        isLiked = !!like;
        isBookmarked = !!bookmark;
      }

      return {
        success: true,
        message: 'Post retrieved successfully',
        data: {
          ...post,
          isLiked,
          isBookmarked,
        },
      };
    });
  }

  async updatePost(id: string, currentUserId: string, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== currentUserId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Post updated successfully',
      data: updatedPost,
    };
  }

  async deletePost(id: string, currentUserId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== currentUserId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.prisma.post.delete({ where: { id } });

    // 更新用戶文章計數
    await this.prisma.user.update({
      where: { id: currentUserId },
      data: { postsCount: { decrement: 1 } },
    });

    return {
      success: true,
      message: 'Post deleted successfully',
      data: null,
    };
  }

  async toggleLike(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // 取消點讚
      await this.prisma.$transaction([
        this.prisma.like.delete({
          where: { id: existingLike.id },
        }),
        this.prisma.post.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } },
        }),
        this.prisma.user.update({
          where: { id: post.authorId },
          data: { totalLikes: { decrement: 1 } },
        }),
      ]);
    } else {
      // 添加點讚
      await this.prisma.$transaction([
        this.prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        this.prisma.post.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } },
        }),
        this.prisma.user.update({
          where: { id: post.authorId },
          data: { totalLikes: { increment: 1 } },
        }),
      ]);
    }

    // 返回更新後的文章
    return this.getPost(postId, userId);
  }

  async toggleBookmark(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingBookmark = await this.prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingBookmark) {
      // 取消收藏
      await this.prisma.$transaction([
        this.prisma.bookmark.delete({
          where: { id: existingBookmark.id },
        }),
        this.prisma.post.update({
          where: { id: postId },
          data: { bookmarksCount: { decrement: 1 } },
        }),
      ]);
    } else {
      // 添加收藏
      await this.prisma.$transaction([
        this.prisma.bookmark.create({
          data: {
            userId,
            postId,
          },
        }),
        this.prisma.post.update({
          where: { id: postId },
          data: { bookmarksCount: { increment: 1 } },
        }),
      ]);
    }

    // 返回更新後的文章
    return this.getPost(postId, userId);
  }
}
