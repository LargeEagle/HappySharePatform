// HAPPY SHARE - 標籤服務
// 管理 Hashtag 標籤功能

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  /**
   * 創建或獲取標籤（內部使用）
   */
  private async createOrGetTag(name: string) {
    // 生成 slug：轉小寫、去除特殊字符、空格轉連字符
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    // 嘗試獲取現有標籤
    let tag = await this.prisma.tag.findUnique({
      where: { slug },
    });

    // 如果不存在，創建新標籤
    if (!tag) {
      tag = await this.prisma.tag.create({
        data: {
          name,
          slug,
        },
      });
    }

    return tag;
  }

  /**
   * 為文章添加標籤
   */
  async addPostTags(postId: string, tagNames: string[], userId: string) {
    // 驗證文章所有權
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('Not authorized to modify this post');
    }

    // 創建或獲取標籤
    const tags = await Promise.all(
      tagNames.map((name) => this.createOrGetTag(name)),
    );

    // 關聯標籤到文章
    const postTags = await Promise.all(
      tags.map((tag) =>
        this.prisma.postTag.upsert({
          where: {
            postId_tagId: {
              postId,
              tagId: tag.id,
            },
          },
          create: {
            postId,
            tagId: tag.id,
          },
          update: {},
        }),
      ),
    );

    // 更新標籤的文章計數
    await Promise.all(
      tags.map((tag) =>
        this.prisma.tag.update({
          where: { id: tag.id },
          data: {
            postsCount: {
              increment: 1,
            },
          },
        }),
      ),
    );

    return {
      success: true,
      message: `Added ${tags.length} tag(s) to post`,
      data: { tags },
    };
  }

  /**
   * 移除文章標籤
   */
  async removePostTag(postId: string, tagId: string, userId: string) {
    // 驗證文章所有權
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('Not authorized to modify this post');
    }

    // 檢查標籤是否存在
    const tag = await this.prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    // 移除關聯
    try {
      await this.prisma.postTag.delete({
        where: {
          postId_tagId: {
            postId,
            tagId,
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Tag is not associated with this post');
    }

    // 更新標籤的文章計數
    await this.prisma.tag.update({
      where: { id: tagId },
      data: {
        postsCount: {
          decrement: 1,
        },
      },
    });

    return {
      success: true,
      message: 'Tag removed from post',
    };
  }

  /**
   * 獲取所有標籤
   */
  async getTags(params: { page: number; limit: number }) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [tags, total] = await Promise.all([
      this.prisma.tag.findMany({
        orderBy: [{ postsCount: 'desc' }, { name: 'asc' }],
        skip,
        take: limit,
      }),
      this.prisma.tag.count(),
    ]);

    return {
      success: true,
      data: {
        tags,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
      },
    };
  }

  /**
   * 獲取熱門標籤
   */
  async getPopularTags(limit: number) {
    const tags = await this.prisma.tag.findMany({
      where: {
        postsCount: {
          gt: 0, // 只返回有文章的標籤
        },
      },
      orderBy: { postsCount: 'desc' },
      take: limit,
    });

    return {
      success: true,
      data: { tags },
    };
  }

  /**
   * 獲取標籤詳情
   */
  async getTag(slug: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { slug },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return {
      success: true,
      data: { tag },
    };
  }

  /**
   * 獲取標籤下的文章
   */
  async getTagPosts(params: {
    slug: string;
    page: number;
    limit: number;
    sort: 'latest' | 'popular';
  }) {
    const { slug, page, limit, sort } = params;
    const skip = (page - 1) * limit;

    // 獲取標籤
    const tag = await this.prisma.tag.findUnique({
      where: { slug },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    // 排序邏輯
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'popular') {
      orderBy = [{ likesCount: 'desc' }, { commentsCount: 'desc' }];
    }

    const [postTags, total] = await Promise.all([
      this.prisma.postTag.findMany({
        where: {
          tagId: tag.id,
          post: { isPublished: true },
        },
        include: {
          post: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                  avatar: true,
                },
              },
              postTags: {
                include: { tag: true },
              },
            },
          },
        },
        skip,
        take: limit,
      }),
      this.prisma.postTag.count({
        where: {
          tagId: tag.id,
          post: { isPublished: true },
        },
      }),
    ]);

    const posts = postTags.map((pt) => pt.post);

    return {
      success: true,
      data: {
        tag,
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
      },
    };
  }
}
