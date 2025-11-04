import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  /**
   * 基本健康檢查
   */
  @Get()
  async healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 數據庫連接檢查
   */
  @Get('db')
  async databaseCheck() {
    try {
      // 執行簡單查詢測試連接
      await this.prisma.$queryRaw`SELECT 1`;
      
      return {
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 詳細狀態檢查
   */
  @Get('status')
  async detailedStatus() {
    const dbStatus = await this.databaseCheck();
    
    return {
      application: 'Happy Share Platform',
      version: '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: dbStatus,
      timestamp: new Date().toISOString(),
    };
  }
}
