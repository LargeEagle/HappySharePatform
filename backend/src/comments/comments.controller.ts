import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('posts/:postId/comments')
  async getPostComments(@Param('postId') postId: string) {
    return this.commentsService.getPostComments(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('posts/:postId/comments')
  async createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.commentsService.createComment(postId, req.user.id, createCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment(@Param('id') id: string, @Request() req) {
    return this.commentsService.deleteComment(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async toggleCommentLike(@Param('id') id: string, @Request() req) {
    return this.commentsService.toggleCommentLike(id, req.user.id);
  }
}
