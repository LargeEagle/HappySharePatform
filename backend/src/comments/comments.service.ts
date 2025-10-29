import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async getPostComments(postId: string, currentUserId?: string) {
    const comments = await this.prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 檢查用戶是否點讚了評論
    const commentsWithLikes = await Promise.all(
      comments.map(async (comment) => {
        if (currentUserId) {
          const isLiked = await this.prisma.like.findUnique({
            where: {
              userId_commentId: {
                userId: currentUserId,
                commentId: comment.id,
              },
            },
          });

          return {
            ...comment,
            isLiked: !!isLiked,
          };
        }

        return {
          ...comment,
          isLiked: false,
        };
      }),
    );

    return {
      success: true,
      message: 'Comments retrieved successfully',
      data: commentsWithLikes,
    };
  }

  async createComment(postId: string, authorId: string, createCommentDto: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = await this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        postId,
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

    // 更新文章評論計數
    await this.prisma.post.update({
      where: { id: postId },
      data: { commentsCount: { increment: 1 } },
    });

    return {
      success: true,
      message: 'Comment created successfully',
      data: {
        ...comment,
        isLiked: false,
      },
    };
  }

  async deleteComment(id: string, currentUserId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== currentUserId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.prisma.comment.delete({ where: { id } });

    // 更新文章評論計數
    await this.prisma.post.update({
      where: { id: comment.postId },
      data: { commentsCount: { decrement: 1 } },
    });

    return {
      success: true,
      message: 'Comment deleted successfully',
      data: null,
    };
  }

  async toggleCommentLike(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    if (existingLike) {
      // 取消點讚
      await this.prisma.$transaction([
        this.prisma.like.delete({
          where: { id: existingLike.id },
        }),
        this.prisma.comment.update({
          where: { id: commentId },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);
    } else {
      // 添加點讚
      await this.prisma.$transaction([
        this.prisma.like.create({
          data: {
            userId,
            commentId,
          },
        }),
        this.prisma.comment.update({
          where: { id: commentId },
          data: { likesCount: { increment: 1 } },
        }),
      ]);
    }

    // 返回更新後的評論
    const updatedComment = await this.prisma.comment.findUnique({
      where: { id: commentId },
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
      message: 'Comment like toggled successfully',
      data: {
        ...updatedComment,
        isLiked: !existingLike,
      },
    };
  }
}
