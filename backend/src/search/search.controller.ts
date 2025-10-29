// HAPPY SHARE - 搜尋控制器
// 處理所有搜尋相關的 HTTP 請求

import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * GET /api/search
   * 綜合搜尋（所有類型）
   */
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async search(
    @Query('q') query: string,
    @Query('type') type?: 'all' | 'posts' | 'users' | 'files' | 'tags',
    @Query('sort') sort?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Request() req?,
  ) {
    if (!query || query.trim().length === 0) {
      return {
        success: false,
        message: 'Search query is required',
      };
    }

    // 記錄搜尋歷史（如果用戶已登入）
    if (req.user) {
      await this.searchService.saveSearchHistory(
        req.user.id,
        query.trim(),
        type || 'all',
      );
    }

    return this.searchService.search({
      query: query.trim(),
      type: type || 'all',
      page,
      limit,
      sort,
    });
  }

  /**
   * GET /api/search/posts
   * 搜尋文章
   */
  @Get('posts')
  async searchPosts(
    @Query('q') query: string,
    @Query('sort') sort?: 'relevant' | 'latest' | 'popular',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    if (!query || query.trim().length === 0) {
      return {
        success: false,
        message: 'Query is required',
      };
    }

    return this.searchService.search({
      query: query.trim(),
      type: 'posts',
      page,
      limit,
      sort: sort || 'relevant',
    });
  }

  /**
   * GET /api/search/users
   * 搜尋用戶
   */
  @Get('users')
  async searchUsers(
    @Query('q') query: string,
    @Query('sort') sort?: 'relevant' | 'followers' | 'posts',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    if (!query || query.trim().length === 0) {
      return {
        success: false,
        message: 'Query is required',
      };
    }

    return this.searchService.search({
      query: query.trim(),
      type: 'users',
      page,
      limit,
      sort,
    });
  }

  /**
   * GET /api/search/files
   * 搜尋文件
   */
  @Get('files')
  async searchFiles(
    @Query('q') query: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    if (!query || query.trim().length === 0) {
      return {
        success: false,
        message: 'Query is required',
      };
    }

    return this.searchService.search({
      query: query.trim(),
      type: 'files',
      page,
      limit,
    });
  }

  /**
   * GET /api/search/tags
   * 搜尋標籤
   */
  @Get('tags')
  async searchTags(
    @Query('q') query: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    if (!query || query.trim().length === 0) {
      return {
        success: false,
        message: 'Query is required',
      };
    }

    return this.searchService.search({
      query: query.trim(),
      type: 'tags',
      page,
      limit,
    });
  }

  /**
   * GET /api/search/suggestions
   * 搜尋建議（自動完成）
   */
  @Get('suggestions')
  async getSuggestions(@Query('q') query: string) {
    if (!query || query.trim().length < 2) {
      return {
        success: true,
        data: { suggestions: [] },
      };
    }

    return this.searchService.getSuggestions(query.trim());
  }

  /**
   * GET /api/search/history
   * 獲取搜尋歷史
   */
  @UseGuards(OptionalJwtAuthGuard)
  @Get('history')
  async getSearchHistory(@Request() req) {
    if (!req.user) {
      return {
        success: true,
        data: { history: [] },
      };
    }

    return this.searchService.getSearchHistory(req.user.id);
  }
}
