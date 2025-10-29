// HAPPY SHARE - 搜尋服務
// 統一的搜尋服務層，使用依賴注入來切換不同的搜尋引擎

import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ISearchEngine } from './interfaces/search-engine.interface';

@Injectable()
export class SearchService {
  constructor(
    @Inject('SEARCH_ENGINE')
    private searchEngine: ISearchEngine,
    private prisma: PrismaService,
  ) {}

  /**
   * 綜合搜尋（所有類型）
   */
  async search(params: {
    query: string;
    type: 'all' | 'posts' | 'users' | 'files' | 'tags';
    page: number;
    limit: number;
    sort?: string;
  }) {
    const { query, type, page, limit, sort } = params;

    if (type === 'posts') {
      const result = await this.searchEngine.searchPosts({
        query,
        page,
        limit,
        sort,
      });
      return {
        success: true,
        message: `Found ${result.total} post(s)`,
        data: {
          posts: result.items,
          pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: Math.ceil(result.total / result.limit),
            hasMore: result.hasMore,
          },
        },
      };
    }

    if (type === 'users') {
      const result = await this.searchEngine.searchUsers({
        query,
        page,
        limit,
        sort,
      });
      return {
        success: true,
        message: `Found ${result.total} user(s)`,
        data: {
          users: result.items,
          pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: Math.ceil(result.total / result.limit),
            hasMore: result.hasMore,
          },
        },
      };
    }

    if (type === 'files') {
      const result = await this.searchEngine.searchFiles({
        query,
        page,
        limit,
      });
      return {
        success: true,
        message: `Found ${result.total} file(s)`,
        data: {
          files: result.items,
          pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: Math.ceil(result.total / result.limit),
            hasMore: result.hasMore,
          },
        },
      };
    }

    if (type === 'tags') {
      const result = await this.searchEngine.searchTags({
        query,
        page,
        limit,
      });
      return {
        success: true,
        message: `Found ${result.total} tag(s)`,
        data: {
          tags: result.items,
          pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: Math.ceil(result.total / result.limit),
            hasMore: result.hasMore,
          },
        },
      };
    }

    // type === 'all'：返回所有類型的結果（各取前 5 個）
    const [posts, users, files, tags] = await Promise.all([
      this.searchEngine.searchPosts({ query, page: 1, limit: 5 }),
      this.searchEngine.searchUsers({ query, page: 1, limit: 5 }),
      this.searchEngine.searchFiles({ query, page: 1, limit: 5 }),
      this.searchEngine.searchTags({ query, page: 1, limit: 5 }),
    ]);

    const totalResults =
      posts.total + users.total + files.total + tags.total;

    return {
      success: true,
      message: `Found ${totalResults} result(s) across all categories`,
      data: {
        query,
        posts: posts.items,
        users: users.items,
        files: files.items,
        tags: tags.items,
        totals: {
          posts: posts.total,
          users: users.total,
          files: files.total,
          tags: tags.total,
        },
      },
    };
  }

  /**
   * 獲取搜尋建議
   */
  async getSuggestions(query: string) {
    const suggestions = await this.searchEngine.getSuggestions(query);
    return {
      success: true,
      data: { suggestions },
    };
  }

  /**
   * 保存搜尋歷史
   */
  async saveSearchHistory(userId: string, query: string, type: string) {
    try {
      await this.prisma.searchHistory.create({
        data: {
          userId,
          query,
          type,
        },
      });
    } catch (error) {
      // 忽略錯誤，搜尋歷史不是關鍵功能
      console.error('Failed to save search history:', error);
    }
  }

  /**
   * 獲取搜尋歷史
   */
  async getSearchHistory(userId: string) {
    const history = await this.prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        query: true,
        type: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      data: { history },
    };
  }
}
