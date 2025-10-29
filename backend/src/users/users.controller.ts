import { Controller, Get, Put, Post, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.usersService.updateUser(id, req.user.id, updateUserDto);
  }

  @Get(':id/posts')
  async getUserPosts(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.usersService.getUserPosts(
      id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  async uploadAvatar(@Body('avatar') avatar: string, @Request() req) {
    return this.usersService.uploadAvatar(req.user.id, avatar);
  }
}
