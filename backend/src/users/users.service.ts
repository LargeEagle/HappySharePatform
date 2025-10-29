import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        location: true,
        website: true,
        postsCount: true,
        followersCount: true,
        followingCount: true,
        totalLikes: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  async updateUser(id: string, currentUserId: string, updateUserDto: UpdateUserDto) {
    // 確保只能更新自己的資料
    if (id !== currentUserId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        location: true,
        website: true,
        postsCount: true,
        followersCount: true,
        followingCount: true,
        totalLikes: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      message: 'User updated successfully',
      data: user,
    };
  }

  async getUserPosts(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { authorId: userId, isPublished: true },
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
        skip,
        take: limit,
      }),
      this.prisma.post.count({
        where: { authorId: userId, isPublished: true },
      }),
    ]);

    // 獲取當前用戶的點讚和收藏狀態（如果已登入）
    const postsWithInteractions = await Promise.all(
      posts.map(async (post) => {
        return {
          ...post,
          isLiked: false, // 可以擴展為檢查實際狀態
          isBookmarked: false, // 可以擴展為檢查實際狀態
        };
      }),
    );

    return {
      success: true,
      message: 'User posts retrieved successfully',
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
  }

  async uploadAvatar(userId: string, avatar: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        avatar: true,
      },
    });

    return {
      success: true,
      message: 'Avatar uploaded successfully',
      data: user,
    };
  }
}
