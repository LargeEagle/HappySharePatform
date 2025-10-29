// HAPPY SHARE - 搜尋模組
// 配置搜尋功能的依賴注入和路由

import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { PostgresSearchEngine } from './engines/postgres-search.engine';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SearchController],
  providers: [
    SearchService,
    {
      provide: 'SEARCH_ENGINE',
      useClass: PostgresSearchEngine, // 當前使用 PostgreSQL
      // 將來切換到 Elasticsearch 只需改這一行：
      // useClass: ElasticsearchEngine,
    },
  ],
  exports: [SearchService],
})
export class SearchModule {}
