// HAPPY SHARE - 標籤模組
// 配置標籤功能的依賴注入和路由

import { Module } from '@nestjs/common';
import { TagsController, PostsTagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TagsController, PostsTagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
