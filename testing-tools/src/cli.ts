#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { ApiTestRunner } from './runner';
import { ReportFormatter } from './reporter';
import { ApiTestConfig } from './types';

const program = new Command();

program
  .name('api-test')
  .description('通用 API 自動化測試工具')
  .version('1.0.0');

program
  .command('run')
  .description('運行 API 測試')
  .option('-c, --config <path>', '配置文件路徑', 'api-test.config.json')
  .option('-o, --output <format>', '輸出格式 (console|json|markdown|html)', 'console')
  .option('-f, --file <path>', '報告輸出文件路徑')
  .option('-v, --verbose', '顯示詳細日誌', false)
  .action(async (options) => {
    try {
      // 讀取配置文件
      const configPath = path.resolve(process.cwd(), options.config);
      if (!fs.existsSync(configPath)) {
        console.error(`❌ 配置文件不存在: ${configPath}`);
        process.exit(1);
      }

      const configContent = fs.readFileSync(configPath, 'utf-8');
      const config: ApiTestConfig = JSON.parse(configContent);

      // 設置詳細日誌
      if (options.verbose) {
        config.verbose = true;
      }

      // 運行測試
      const runner = new ApiTestRunner(config);
      const report = await runner.runAll();

      // 輸出報告
      switch (options.output) {
        case 'console':
          ReportFormatter.printConsoleReport(report);
          break;

        case 'json':
          const jsonReport = ReportFormatter.generateJsonReport(report);
          if (options.file) {
            fs.writeFileSync(options.file, jsonReport);
            console.log(`✅ JSON 報告已保存到: ${options.file}`);
          } else {
            console.log(jsonReport);
          }
          break;

        case 'markdown':
          const mdReport = ReportFormatter.generateMarkdownReport(report);
          if (options.file) {
            fs.writeFileSync(options.file, mdReport);
            console.log(`✅ Markdown 報告已保存到: ${options.file}`);
          } else {
            console.log(mdReport);
          }
          break;

        case 'html':
          const htmlReport = ReportFormatter.generateHtmlReport(report);
          if (options.file) {
            fs.writeFileSync(options.file, htmlReport);
            console.log(`✅ HTML 報告已保存到: ${options.file}`);
          } else {
            console.log(htmlReport);
          }
          break;

        default:
          console.error(`❌ 不支持的輸出格式: ${options.output}`);
          process.exit(1);
      }

      // 如果有失敗的測試，退出碼設為 1
      if (report.summary.failedTests > 0) {
        process.exit(1);
      }
    } catch (error: any) {
      console.error(`❌ 錯誤: ${error.message}`);
      if (options.verbose && error.stack) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

program
  .command('init')
  .description('初始化配置文件')
  .option('-n, --name <name>', '項目名稱', 'My API Project')
  .option('-u, --url <url>', 'API 基礎 URL', 'http://localhost:5000/api')
  .action((options) => {
    const config: ApiTestConfig = {
      projectName: options.name,
      baseUrl: options.url,
      timeout: 30000,
      verbose: false,
      globalHeaders: {
        'Content-Type': 'application/json',
      },
      globalVariables: {},
      testSuites: [
        {
          name: '範例測試套件',
          description: '這是一個範例測試套件',
          tests: [
            {
              name: '測試健康檢查',
              method: 'GET',
              path: '/health',
              expect: {
                status: 200,
              },
            },
          ],
        },
      ],
    };

    const configPath = path.resolve(process.cwd(), 'api-test.config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`✅ 配置文件已創建: ${configPath}`);
  });

program
  .command('validate')
  .description('驗證配置文件')
  .option('-c, --config <path>', '配置文件路徑', 'api-test.config.json')
  .action((options) => {
    try {
      const configPath = path.resolve(process.cwd(), options.config);
      if (!fs.existsSync(configPath)) {
        console.error(`❌ 配置文件不存在: ${configPath}`);
        process.exit(1);
      }

      const configContent = fs.readFileSync(configPath, 'utf-8');
      const config: ApiTestConfig = JSON.parse(configContent);

      // 基本驗證
      if (!config.projectName) {
        throw new Error('缺少 projectName');
      }
      if (!config.baseUrl) {
        throw new Error('缺少 baseUrl');
      }
      if (!config.testSuites || config.testSuites.length === 0) {
        throw new Error('至少需要一個測試套件');
      }

      console.log('✅ 配置文件驗證通過');
      console.log(`   項目名稱: ${config.projectName}`);
      console.log(`   基礎 URL: ${config.baseUrl}`);
      console.log(`   測試套件數量: ${config.testSuites.length}`);
      
      let totalTests = 0;
      config.testSuites.forEach((suite) => {
        totalTests += suite.tests.length;
      });
      console.log(`   總測試數: ${totalTests}`);
    } catch (error: any) {
      console.error(`❌ 配置文件驗證失敗: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
