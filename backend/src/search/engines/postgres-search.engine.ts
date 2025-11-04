// HAPPY SHARE - PostgreSQL 搜尋引擎實現
// 使用 PostgreSQL ILIKE 進行模糊搜尋

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ISearchEngine,
  SearchParams,
  SearchResult,
  Suggestion,
} from '../interfaces/search-engine.interface';

@Injectable()
export class PostgresSearchEngine implements ISearchEngine {
  constructor(private prisma: PrismaService) {}

  // ===== 索引操作（PostgreSQL 中這些是空操作）=====

  async indexPost(postId: string): Promise<void> {
    // PostgreSQL 不需要顯式索引，數據已在數據庫中
    console.log(`[PostgreSQL] Post ${postId} already in database`);
  }

  async updatePost(postId: string): Promise<void> {
    // PostgreSQL 通過 Prisma 自動更新
    console.log(`[PostgreSQL] Post ${postId} updated in database`);
  }

  async deletePost(postId: string): Promise<void> {
    // PostgreSQL 通過 Prisma 自動刪除
    console.log(`[PostgreSQL] Post ${postId} deleted from database`);
  }

  async bulkIndexPosts(postIds: string[]): Promise<void> {
    console.log(`[PostgreSQL] Bulk indexing ${postIds.length} posts`);
  }

  // ===== 搜尋操作 =====

  /**
   * 搜尋文章
   */
  async searchPosts(params: SearchParams): Promise<SearchResult> {
    const { query, page, limit, sort } = params;
    const skip = (page - 1) * limit;

    const where = {
      isPublished: true,
      OR: [
        { title: { contains: query, mode: 'insensitive' as const } },
        { content: { contains: query, mode: 'insensitive' as const } },
      ],
    };

    // 排序邏輯
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'popular') {
      orderBy = [
        { likesCount: 'desc' },
        { commentsCount: 'desc' },
        { createdAt: 'desc' },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
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
            include: {
              tag: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    };
  }

  /**
   * 搜尋用戶
   */
  async searchUsers(params: SearchParams): Promise<SearchResult> {
    const { query, page, limit, sort } = params;
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { username: { contains: query, mode: 'insensitive' as const } },
        { name: { contains: query, mode: 'insensitive' as const } },
        { bio: { contains: query, mode: 'insensitive' as const } },
      ],
    };

    // 排序邏輯
    let orderBy: any = { followersCount: 'desc' };
    if (sort === 'posts') {
      orderBy = { postsCount: 'desc' };
    }

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          name: true,
          bio: true,
          avatar: true,
          location: true,
          followersCount: true,
          followingCount: true,
          postsCount: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    };
  }

  /**
   * 搜尋文件
   * TODO: 修復連接池問題後啟用
   */
  async searchFiles(params: SearchParams): Promise<SearchResult> {
    const { page, limit } = params;
    
    // 暫時返回空結果以避免連接池超時問題
    console.log('[PostgreSQL] File search temporarily disabled due to connection pool issues');
    
    return {
      items: [],
      total: 0,
      page,
      limit,
      hasMore: false,
    };

    /* 原始實現 - 連接池問題待修復
    const { query, page, limit } = params;
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { filename: { contains: query, mode: 'insensitive' as const } },
        { originalName: { contains: query, mode: 'insensitive' as const } },
      ],
    };

    const [items, total] = await Promise.all([
      this.prisma.attachment.findMany({
        where,
        include: {
          post: {
            select: {
              id: true,
              title: true,
            },
          },
          uploader: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.attachment.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    };
    */
  }

  /**
   * 搜尋標籤
   */
  async searchTags(params: SearchParams): Promise<SearchResult> {
    const { query, page, limit } = params;
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { name: { contains: query, mode: 'insensitive' as const } },
        { slug: { contains: query, mode: 'insensitive' as const } },
        { description: { contains: query, mode: 'insensitive' as const } },
      ],
    };

    const [items, total] = await Promise.all([
      this.prisma.tag.findMany({
        where,
        orderBy: { postsCount: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.tag.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    };
  }

  /**
   * 獲取搜尋建議
   * 改進版：支持從文章標題、標籤（中英文）、用戶獲取建議
   * 添加自動重試機制以處理連接問題
   */
  async getSuggestions(query: string): Promise<Suggestion[]> {
    if (query.length < 2) {
      return [];
    }

    // 使用 PrismaService 的重試邏輯執行查詢
    return this.prisma.executeWithRetry(async () => {
      // 並行查詢多個來源
      const [tags, users, posts] = await Promise.all([
        // 1. 標籤建議（匹配標籤名稱或 slug）
        this.prisma.tag.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { slug: { contains: query, mode: 'insensitive' } },
            ],
          },
          select: { name: true, slug: true, postsCount: true },
          orderBy: { postsCount: 'desc' },
          take: 3,
        }),
        // 2. 用戶建議
        this.prisma.user.findMany({
          where: {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { name: { contains: query, mode: 'insensitive' } },
            ],
          },
          select: { username: true, name: true, avatar: true },
          orderBy: { followersCount: 'desc' },
          take: 2,
        }),
        // 3. 文章標題建議（新增）
        this.prisma.post.findMany({
          where: {
            isPublished: true,
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } },
            ],
          },
          select: { 
            title: true,
            likesCount: true,
            commentsCount: true,
          },
          orderBy: [
            { likesCount: 'desc' },
            { commentsCount: 'desc' },
          ],
          take: 3,
        }),
      ]);

      const suggestions: Suggestion[] = [];

      // 添加文章標題建議（優先級最高，因為最具體）
      posts.forEach((post) => {
        suggestions.push({
          text: post.title,
          type: 'post' as const,
          count: post.likesCount + post.commentsCount,
        });
      });

      // 添加標籤建議
      tags.forEach((tag) => {
        suggestions.push({
          text: tag.name,
          type: 'tag' as const,
          count: tag.postsCount,
        });
      });

      // 添加用戶建議
      users.forEach((user) => {
        suggestions.push({
          text: user.name || user.username,
          type: 'user' as const,
          avatar: user.avatar,
        });
      });

      // 限制總數為 8 個建議
      return suggestions.slice(0, 8);
    });
  }
}
