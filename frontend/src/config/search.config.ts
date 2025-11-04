/**
 * 搜尋功能配置
 * 用於控制搜尋數據源（模擬數據 vs 真實API）
 */

export const searchConfig = {
  /**
   * 是否使用模擬數據
   * - true: 使用本地模擬數據，不調用API（用於測試渲染邏輯）
   * - false: 調用真實的後端API
   */
  useMockData: true,  // 👈 開啟模擬數據模式測試

  /**
   * 模擬API延遲（毫秒）
   * 僅在 useMockData=true 時生效
   */
  mockDelay: 500,

  /**
   * 是否顯示數據源標識（開發模式）
   */
  showDataSource: __DEV__,
};

/**
 * 快速切換函數（用於開發調試）
 */
export const toggleMockData = () => {
  searchConfig.useMockData = !searchConfig.useMockData;
  console.log(`[SearchConfig] Mock data ${searchConfig.useMockData ? 'ENABLED' : 'DISABLED'}`);
};
