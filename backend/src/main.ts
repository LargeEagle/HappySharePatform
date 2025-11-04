import { config } from 'dotenv';
// 在應用啟動前加載環境變量
config({ path: '.env' });

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 啟用全局驗證管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自動移除未定義的屬性
      forbidNonWhitelisted: true, // 拒絕未定義的屬性
      transform: true, // 自動轉換類型
    }),
  );
  
  // 啟用 CORS（開發環境允許所有來源）
  app.enableCors({
    origin: true, // 允許所有來源
    credentials: true, // 允許攜帶憑證
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  
  // 設置全局前綴
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 5000;
  await app.listen(port, '0.0.0.0'); // 明確監聽所有接口
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`🌐 Also accessible via: http://127.0.0.1:${port}/api`);
}
bootstrap();
