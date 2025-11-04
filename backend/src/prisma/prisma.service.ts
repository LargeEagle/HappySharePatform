import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private healthCheckInterval: NodeJS.Timeout;
  private isConnected = false;

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.connectWithRetry(3, 2000);
    } catch (error) {
      this.logger.error('❌ Initial connection failed, will retry on queries');
    }
    this.startHealthCheck();
  }

  async onModuleDestroy() {
    this.stopHealthCheck();
    try {
      await this.$disconnect();
      this.isConnected = false;
      this.logger.log('❌ Prisma disconnected from database');
    } catch (error) {
      this.logger.error('Error during disconnect', error);
    }
  }

  private async connectWithRetry(maxRetries = 3, baseDelay = 1000): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.log(`🔄 Connecting to database (attempt ${attempt}/${maxRetries})...`);
        await this.$connect();
        await this.$queryRaw`SELECT 1`;
        this.isConnected = true;
        this.logger.log('✅ Prisma connected to database');
        return;
      } catch (error) {
        this.logger.warn(`⚠️ Connection attempt ${attempt}/${maxRetries} failed: ${error.message}`);
        if (attempt < maxRetries) {
          const waitTime = baseDelay * attempt;
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
    throw new Error('Failed to connect after all retries');
  }

  private startHealthCheck(): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.$queryRaw`SELECT 1`;
        if (!this.isConnected) {
          this.logger.log('✅ Database connection restored');
          this.isConnected = true;
        }
      } catch (error) {
        if (this.isConnected) {
          this.logger.warn('⚠️ Database health check failed');
          this.isConnected = false;
        }
      }
    }, 30000);
  }

  private stopHealthCheck(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }

  async executeWithRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        if (!this.isConnected) {
          this.isConnected = true;
        }
        return result;
      } catch (error) {
        const isConnectionError = 
          error.code === 'P1001' || 
          error.code === 'P1017' ||
          error.code === 'P2024' ||
          error.message?.includes("Can't reach database server") ||
          error.message?.includes("Connection closed");

        if (isConnectionError && attempt < maxRetries) {
          this.logger.warn(`🔄 Query failed (attempt ${attempt}/${maxRetries}), retrying...`);
          try {
            await this.$disconnect();
            await new Promise(resolve => setTimeout(resolve, 500));
            await this.$connect();
          } catch (reconnectError) {
            this.logger.warn('Reconnect failed, continuing...');
          }
          await new Promise(resolve => setTimeout(resolve, 500 * attempt));
        } else {
          if (isConnectionError) {
            this.isConnected = false;
          }
          throw error;
        }
      }
    }
    throw new Error('Query failed after all retries');
  }
}
