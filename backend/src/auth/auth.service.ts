import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password, name } = registerDto;

    // 檢查用戶是否已存在
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Email already exists');
      }
      throw new ConflictException('Username already exists');
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 創建用戶
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        name: name || username,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        avatar: true,
      },
    });

    // 生成 JWT Token
    const token = this.generateToken(user.id);

    return {
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 查找用戶
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 生成 JWT Token
    const token = this.generateToken(user.id);

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
        token,
      },
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
      throw new UnauthorizedException('User not found');
    }

    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  private generateToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }
}
