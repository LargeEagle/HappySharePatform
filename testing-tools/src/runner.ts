import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ApiTestConfig,
  TestCase,
  TestExpectation,
  TestResult,
  TestSuiteResult,
  TestReport,
} from './types';

/**
 * API 測試執行器
 */
export class ApiTestRunner {
  private axiosInstance: AxiosInstance;
  private variables: Map<string, any>;
  private config: ApiTestConfig;

  constructor(config: ApiTestConfig) {
    this.config = config;
    this.variables = new Map();

    // 初始化全局變數
    if (config.globalVariables) {
      Object.entries(config.globalVariables).forEach(([key, value]) => {
        this.variables.set(key, value);
      });
    }

    // 創建 axios 實例
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      headers: config.globalHeaders || {},
      validateStatus: () => true, // 接受所有狀態碼
    });
  }

  /**
   * 運行所有測試套件
   */
  async runAll(): Promise<TestReport> {
    const startTime = new Date();
    const suiteResults: TestSuiteResult[] = [];

    console.log(`\n🚀 開始測試項目: ${this.config.projectName}`);
    console.log(`📍 基礎 URL: ${this.config.baseUrl}\n`);

    for (const suite of this.config.testSuites) {
      const result = await this.runTestSuite(suite);
      suiteResults.push(result);
    }

    const endTime = new Date();

    // 計算總體統計
    const summary = {
      totalTests: suiteResults.reduce((sum, s) => sum + s.total, 0),
      passedTests: suiteResults.reduce((sum, s) => sum + s.passed, 0),
      failedTests: suiteResults.reduce((sum, s) => sum + s.failed, 0),
      skippedTests: suiteResults.reduce((sum, s) => sum + s.skipped, 0),
      successRate: 0,
      totalDuration: suiteResults.reduce((sum, s) => sum + s.duration, 0),
    };

    summary.successRate =
      summary.totalTests > 0
        ? (summary.passedTests / summary.totalTests) * 100
        : 0;

    return {
      projectName: this.config.projectName,
      startTime,
      endTime,
      suiteResults,
      summary,
    };
  }

  /**
   * 運行單個測試套件
   */
  private async runTestSuite(suite: any): Promise<TestSuiteResult> {
    console.log(`\n📦 測試套件: ${suite.name}`);
    if (suite.description) {
      console.log(`   ${suite.description}`);
    }

    const results: TestResult[] = [];
    const startTime = Date.now();

    // 執行 beforeAll 鉤子
    if (suite.beforeAll) {
      await this.executeHooks(suite.beforeAll);
    }

    // 執行測試用例
    for (const test of suite.tests) {
      if (test.skip) {
        console.log(`   ⏭️  跳過: ${test.name}`);
        results.push({
          name: test.name,
          passed: false,
          duration: 0,
          error: 'Skipped',
        });
        continue;
      }

      const result = await this.runTestCase(test);
      results.push(result);

      // 打印結果
      if (result.passed) {
        console.log(`   ✅ ${test.name} (${result.duration}ms)`);
      } else {
        console.log(`   ❌ ${test.name}`);
        console.log(`      錯誤: ${result.error}`);
      }
    }

    // 執行 afterAll 鉤子
    if (suite.afterAll) {
      await this.executeHooks(suite.afterAll);
    }

    const duration = Date.now() - startTime;

    const passed = results.filter((r) => r.passed).length;
    const failed = results.filter((r) => !r.passed && r.error !== 'Skipped').length;
    const skipped = results.filter((r) => r.error === 'Skipped').length;

    return {
      name: suite.name,
      results,
      total: results.length,
      passed,
      failed,
      skipped,
      duration,
    };
  }

  /**
   * 執行單個測試用例
   */
  private async runTestCase(test: TestCase): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // 替換路徑中的變數
      const path = this.replaceVariables(test.path);

      // 替換請求體中的變數
      const body = test.body ? this.replaceVariables(JSON.stringify(test.body)) : undefined;

      // 替換請求頭中的變數
      const headers = test.headers
        ? JSON.parse(this.replaceVariables(JSON.stringify(test.headers)))
        : {};

      // 發送請求
      const response = await this.axiosInstance.request({
        method: test.method,
        url: path,
        data: body ? JSON.parse(body) : undefined,
        params: test.params,
        headers,
      });

      // 驗證響應
      const validationError = this.validateResponse(response, test.expect);
      if (validationError) {
        return {
          name: test.name,
          passed: false,
          duration: Date.now() - startTime,
          error: validationError,
          response: {
            status: response.status,
            data: response.data,
            headers: response.headers as Record<string, string>,
          },
        };
      }

      // 提取變數
      if (test.extract) {
        this.extractVariables(response.data, test.extract);
      }

      return {
        name: test.name,
        passed: true,
        duration: Date.now() - startTime,
        response: {
          status: response.status,
          data: response.data,
          headers: response.headers as Record<string, string>,
        },
      };
    } catch (error: any) {
      return {
        name: test.name,
        passed: false,
        duration: Date.now() - startTime,
        error: error.message,
      };
    }
  }

  /**
   * 驗證響應
   */
  private validateResponse(
    response: AxiosResponse,
    expect: TestExpectation
  ): string | null {
    // 驗證狀態碼
    if (expect.status !== undefined && response.status !== expect.status) {
      return `預期狀態碼 ${expect.status}，實際得到 ${response.status}`;
    }

    // 驗證響應體
    if (expect.body) {
      for (const [path, expectedValue] of Object.entries(expect.body)) {
        const actualValue = this.getNestedValue(response.data, path);
        
        if (expectedValue === '{{ANY}}') {
          // 只檢查字段是否存在
          if (actualValue === undefined) {
            return `預期字段 "${path}" 存在，但未找到`;
          }
        } else if (expectedValue === '{{NOT_EMPTY}}') {
          // 檢查字段存在且不為空
          if (!actualValue) {
            return `預期字段 "${path}" 不為空，但得到 ${actualValue}`;
          }
        } else if (JSON.stringify(actualValue) !== JSON.stringify(expectedValue)) {
          return `字段 "${path}" 預期值為 ${JSON.stringify(expectedValue)}，實際得到 ${JSON.stringify(actualValue)}`;
        }
      }
    }

    // 驗證響應頭
    if (expect.headers) {
      for (const [header, expectedValue] of Object.entries(expect.headers)) {
        const actualValue = response.headers[header.toLowerCase()];
        if (expectedValue instanceof RegExp) {
          if (!expectedValue.test(actualValue)) {
            return `響應頭 "${header}" 不符合正則表達式 ${expectedValue}`;
          }
        } else if (actualValue !== expectedValue) {
          return `響應頭 "${header}" 預期值為 ${expectedValue}，實際得到 ${actualValue}`;
        }
      }
    }

    return null;
  }

  /**
   * 獲取嵌套對象的值
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * 從響應中提取變數
   */
  private extractVariables(data: any, extract: Record<string, string>): void {
    for (const [varName, path] of Object.entries(extract)) {
      const value = this.getNestedValue(data, path);
      this.variables.set(varName, value);
      if (this.config.verbose) {
        console.log(`   📝 提取變數: ${varName} = ${value}`);
      }
    }
  }

  /**
   * 替換字符串中的變數
   */
  private replaceVariables(str: string): string {
    return str.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      const value = this.variables.get(varName);
      if (value === undefined) {
        console.warn(`   ⚠️  警告: 變數 "${varName}" 未定義`);
        return match;
      }
      return value;
    });
  }

  /**
   * 執行測試鉤子
   */
  private async executeHooks(hooks: any[]): Promise<void> {
    for (const hook of hooks) {
      if (hook.type === 'request' && hook.request) {
        await this.runTestCase({
          name: 'Hook Request',
          ...hook.request,
          expect: { status: 200 },
        } as TestCase);
      } else if (hook.type === 'script' && hook.script) {
        // 執行腳本（可以擴展此功能）
        console.log(`   🔧 執行腳本: ${hook.script}`);
      }
    }
  }

  /**
   * 獲取變數值
   */
  getVariable(name: string): any {
    return this.variables.get(name);
  }

  /**
   * 設置變數值
   */
  setVariable(name: string, value: any): void {
    this.variables.set(name, value);
  }
}
