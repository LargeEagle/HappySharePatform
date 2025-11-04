import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { SearchModule } from './search/search.module';
import { TagsModule } from './tags/tags.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // 加載環境變數（必須在最前面）
    ConfigModule.forRoot({
      isGlobal: true, // 全局可用
      envFilePath: '.env', // 指定 .env 文件路徑
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    SearchModule,
    TagsModule,
    HealthModule, // 新增：健康檢查模組
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
