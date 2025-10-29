// HAPPY SHARE - 標籤控制器
// 處理標籤相關的 HTTP 請求

import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  /**
   * GET /api/tags
   * 獲取所有標籤
   */
  @Get()
  async getTags(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.tagsService.getTags({ page, limit });
  }

  /**
   * GET /api/tags/popular
   * 獲取熱門標籤
   */
  @Get('popular')
  async getPopularTags(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return this.tagsService.getPopularTags(limit);
  }

  /**
   * GET /api/tags/:slug
   * 獲取標籤詳情
   */
  @Get(':slug')
  async getTag(@Param('slug') slug: string) {
    return this.tagsService.getTag(slug);
  }

  /**
   * GET /api/tags/:slug/posts
   * 獲取標籤下的文章
   */
  @Get(':slug/posts')
  async getTagPosts(
    @Param('slug') slug: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('sort') sort?: 'latest' | 'popular',
  ) {
    return this.tagsService.getTagPosts({
      slug,
      page,
      limit,
      sort: sort || 'latest',
    });
  }
}

/**
 * 文章標籤控制器
 * 管理文章與標籤的關聯
 */
@Controller('posts')
export class PostsTagsController {
  constructor(private readonly tagsService: TagsService) {}

  /**
   * POST /api/posts/:id/tags
   * 為文章添加標籤
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/tags')
  async addPostTags(
    @Param('id') postId: string,
    @Body('tags') tags: string[], // 標籤名稱數組
    @Request() req,
  ) {
    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return {
        success: false,
        message: 'Tags array is required',
      };
    }

    return this.tagsService.addPostTags(postId, tags, req.user.id);
  }

  /**
   * DELETE /api/posts/:id/tags/:tagId
   * 移除文章標籤
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id/tags/:tagId')
  async removePostTag(
    @Param('id') postId: string,
    @Param('tagId') tagId: string,
    @Request() req,
  ) {
    return this.tagsService.removePostTag(postId, tagId, req.user.id);
  }
}
