import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.createPost(req.user.id, createPostDto);
  }

  @Get()
  async getPosts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: 'latest' | 'popular',
  ) {
    return this.postsService.getPosts({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      sort: sort || 'latest',
    });
  }

  @Get(':id')
  async getPost(@Param('id') id: string) {
    return this.postsService.getPost(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    return this.postsService.updatePost(id, req.user.id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string, @Request() req) {
    return this.postsService.deletePost(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async toggleLike(@Param('id') id: string, @Request() req) {
    return this.postsService.toggleLike(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/bookmark')
  async toggleBookmark(@Param('id') id: string, @Request() req) {
    return this.postsService.toggleBookmark(id, req.user.id);
  }
}
