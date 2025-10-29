/**
 * API 測試配置接口
 */
export interface ApiTestConfig {
  /** 項目名稱 */
  projectName: string;
  /** API 基礎 URL */
  baseUrl: string;
  /** 測試套件列表 */
  testSuites: TestSuite[];
  /** 全局變數（可在測試中使用） */
  globalVariables?: Record<string, any>;
  /** 全局請求頭 */
  globalHeaders?: Record<string, string>;
  /** 請求超時時間（毫秒） */
  timeout?: number;
  /** 是否顯示詳細日誌 */
  verbose?: boolean;
}

/**
 * 測試套件接口
 */
export interface TestSuite {
  /** 套件名稱 */
  name: string;
  /** 套件描述 */
  description?: string;
  /** 測試用例列表 */
  tests: TestCase[];
  /** 套件級別的前置操作 */
  beforeAll?: TestHook[];
  /** 套件級別的後置操作 */
  afterAll?: TestHook[];
}

/**
 * 測試用例接口
 */
export interface TestCase {
  /** 測試用例名稱 */
  name: string;
  /** 測試描述 */
  description?: string;
  /** HTTP 方法 */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** API 端點路徑 */
  path: string;
  /** 請求頭 */
  headers?: Record<string, string>;
  /** 請求參數（查詢參數） */
  params?: Record<string, any>;
  /** 請求體 */
  body?: any;
  /** 預期響應 */
  expect: TestExpectation;
  /** 從響應中提取變數（用於後續測試） */
  extract?: Record<string, string>;
  /** 是否跳過此測試 */
  skip?: boolean;
  /** 測試依賴的變數 */
  dependencies?: string[];
}

/**
 * 測試期望接口
 */
export interface TestExpectation {
  /** 預期 HTTP 狀態碼 */
  status?: number;
  /** 預期響應體包含的字段 */
  body?: {
    /** 字段路徑（支持嵌套，如 "data.user.id"） */
    [key: string]: any;
  };
  /** 預期響應頭 */
  headers?: Record<string, string | RegExp>;
  /** 自定義驗證函數 */
  custom?: string; // JavaScript 代碼字符串
}

/**
 * 測試鉤子接口
 */
export interface TestHook {
  /** 鉤子類型 */
  type: 'request' | 'script';
  /** 如果是 request 類型 */
  request?: Omit<TestCase, 'expect' | 'name'>;
  /** 如果是 script 類型 */
  script?: string;
}

/**
 * 測試結果接口
 */
export interface TestResult {
  /** 測試用例名稱 */
  name: string;
  /** 是否通過 */
  passed: boolean;
  /** 執行時間（毫秒） */
  duration: number;
  /** 錯誤信息（如果失敗） */
  error?: string;
  /** 響應數據 */
  response?: {
    status: number;
    data: any;
    headers: Record<string, string>;
  };
}

/**
 * 測試套件結果接口
 */
export interface TestSuiteResult {
  /** 套件名稱 */
  name: string;
  /** 測試結果列表 */
  results: TestResult[];
  /** 總測試數 */
  total: number;
  /** 通過數 */
  passed: number;
  /** 失敗數 */
  failed: number;
  /** 跳過數 */
  skipped: number;
  /** 總執行時間（毫秒） */
  duration: number;
}

/**
 * 測試報告接口
 */
export interface TestReport {
  /** 項目名稱 */
  projectName: string;
  /** 測試開始時間 */
  startTime: Date;
  /** 測試結束時間 */
  endTime: Date;
  /** 套件結果列表 */
  suiteResults: TestSuiteResult[];
  /** 總體統計 */
  summary: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    skippedTests: number;
    successRate: number;
    totalDuration: number;
  };
}
