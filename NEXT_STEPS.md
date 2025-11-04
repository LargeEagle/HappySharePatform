# 下次開發計劃

**最後更新**: 2025-11-02  
**當前狀態**: ✅ 系統穩定運行，搜索結果頁面基本完成

---

## 📊 系統當前狀態

### ✅ 正常運行的服務

1. **後端服務** (Port 5000)
   - NestJS + Prisma + PostgreSQL
   - 18 個 API 端點全部正常
   - N+1 查詢問題已修復
   - 性能優化完成（API < 1s）

2. **前端服務** (Port 8081)
   - React Native + Expo Web
   - 主題系統正常
   - 用戶認證正常
   - 文章列表和互動功能正常
   - 搜索導航正常

### ⚠️ 需要注意的問題

1. **搜索建議性能問題** (高優先級)
   - **現象**: 快速輸入時多個請求被中止 (ERR_ABORTED)
   - **影響**: API 超時，可能導致頁面崩潰
   - **原因**: 缺少 debounce 防抖動機制
   - **狀態**: 待修復

2. **"Unexpected text node" 警告** (中優先級)
   - **現象**: Console 顯示多個警告
   - **影響**: 不影響功能，但影響開發體驗
   - **狀態**: 待修復

---

## 🚀 下次開發優先級

### 🔥 最高優先級：性能優化

#### 任務 1: 添加搜索建議 Debounce
**目標**: 減少 API 調用，防止請求超時

**實現步驟**:
```typescript
// 1. 創建 useDebounce Hook
// frontend/src/hooks/useDebounce.ts

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 2. 在 SearchScreen.tsx 中使用
const debouncedQuery = useDebounce(state.query, 500);

useEffect(() => {
  if (debouncedQuery.length >= 2) {
    loadSuggestions();
  } else {
    setState((prev) => ({ ...prev, suggestions: [], showSuggestions: false }));
  }
}, [debouncedQuery]);
```

**預期效果**:
- 請求數量減少 80%+
- 不再出現 ERR_ABORTED
- 用戶體驗更流暢

**測試方法**:
```bash
# 1. 啟動前端
cd frontend && npm start

# 2. 打開瀏覽器 http://localhost:8081
# 3. 登入後進入搜索頁面
# 4. 快速輸入 "typescript"
# 5. 觀察 Network 面板，應該只有 1-2 個請求
```

---

#### 任務 2: 實現請求取消機制
**目標**: 新請求時自動取消舊請求

**實現步驟**:
```typescript
// 在 SearchScreen.tsx 中
useEffect(() => {
  const controller = new AbortController();
  
  if (debouncedQuery.length >= 2) {
    loadSuggestions(controller.signal);
  }
  
  return () => {
    controller.abort();  // 組件卸載或查詢變化時取消請求
  };
}, [debouncedQuery]);

async function loadSuggestions(signal?: AbortSignal) {
  try {
    const response = await searchService.getSuggestions(state.query, { signal });
    setState(prev => ({ 
      ...prev, 
      suggestions: response.data.suggestions,
      showSuggestions: true 
    }));
  } catch (error: any) {
    if (error.name !== 'AbortError') {
      console.error('Failed to load suggestions:', error);
      setState(prev => ({ ...prev, suggestions: [], showSuggestions: false }));
    }
  }
}
```

**預期效果**:
- 資源浪費減少
- 不會有無用的請求完成
- 避免競態條件

---

### 📋 高優先級：功能完善

#### 任務 3: 搜索建議 UI 優化
**當前狀態**: 建議數據正常返回，但只顯示 debug 信息

**需要實現**:
1. 將 debug 代碼移除或改為僅開發環境
2. 正常顯示建議列表（已有代碼，應該會自動顯示）
3. 優化建議項樣式
4. 添加加載狀態指示器

**文件位置**: `frontend/src/screens/SearchScreen.tsx`

**代碼位置**:
```typescript
// 移除或條件化這段代碼
{__DEV__ && state.query.length >= 2 && (
  <Text style={{ padding: 16, color: 'red' }}>
    Debug - Query: {state.query}, Suggestions: {state.suggestions.length}, Show: {state.showSuggestions ? 'true' : 'false'}
  </Text>
)}
```

---

#### 任務 4: 手動測試搜索功能
**原因**: 自動化測試發現 React Native Web 的 `onSubmitEditing` 無法模擬

**測試步驟**:
```bash
# 1. 確保兩個服務都在運行
lsof -i :5000  # 後端
lsof -i :8081  # 前端

# 2. 打開瀏覽器: http://localhost:8081
# 3. 使用測試帳號登入: bob@happyshare.com / Test@1234
# 4. 點擊首頁的搜索按鈕
# 5. 輸入 "typescript" 並按 Enter
# 6. 驗證:
#    - 顯示搜索結果（應該有 1 篇文章）
#    - 文章標題: "TypeScript 最佳實踐"
#    - 作者: david
#    - 切換到"文章"標籤，確認結果一致
#    - 切換到"用戶"標籤，應該顯示"找不到相關用戶"
```

**預期結果**:
- ✅ 搜索結果正確顯示
- ✅ 分類切換正常
- ✅ 空狀態提示正確
- ✅ "查看全部"按鈕正常工作

---

### 🐛 中優先級：Bug 修復

#### 任務 5: 修復 "Unexpected text node" 警告

**排查步驟**:
```bash
# 1. 在 SearchScreen.tsx 中搜索以下模式：
# - <View>. (View 標籤後直接跟文本)
# - <View>{variable}</View> (變數沒有包裹在 Text 中)

# 2. 常見錯誤位置：
# - Debug 信息顯示
# - 條件渲染的文本
# - 動態插值的變數
```

**修復方法**:
```typescript
// ❌ 錯誤
<View>
  Some text
</View>

// ✅ 正確
<View>
  <Text>Some text</Text>
</View>

// ❌ 錯誤
<View>{count}</View>

// ✅ 正確
<View>
  <Text>{count}</Text>
</View>
```

---

## 📝 下次開發建議順序

1. ⏱️ **添加 Debounce** (30 分鐘)
   - 創建 useDebounce hook
   - 在 SearchScreen 中應用
   - 測試驗證

2. 🚫 **實現請求取消** (30 分鐘)
   - 添加 AbortController
   - 更新 loadSuggestions 函數
   - 測試驗證

3. 🧪 **手動測試** (15 分鐘)
   - 完整測試搜索流程
   - 驗證所有分類
   - 確認無錯誤

4. 🎨 **UI 優化** (20 分鐘)
   - 移除 debug 代碼
   - 優化建議顯示
   - 添加加載狀態

5. 🐛 **修復警告** (15 分鐘)
   - 查找並修復文本節點問題
   - 驗證無 console 警告

**預計總時間**: 約 2 小時

---

## 🔧 開發環境檢查清單

在開始下次開發前，請確認：

- [ ] Node.js 正常運行
- [ ] PostgreSQL/Supabase 連接正常
- [ ] 後端服務可以啟動 (`cd backend && npm run start:dev`)
- [ ] 前端服務可以啟動 (`cd frontend && npm start`)
- [ ] 測試帳號可以登入
- [ ] 查看 `開發文件.md` 了解最新進展

**快速啟動命令**:
```bash
# 後端（在 backend/ 目錄）
npm run start:dev

# 前端（在 frontend/ 目錄）
npm start

# 或使用根目錄的命令
npm run dev  # 同時啟動前後端
```

---

## 📚 相關文檔

- **詳細開發記錄**: `docs/開發文件.md`
- **問題排查指南**: `docs/TROUBLESHOOTING.md`
- **API 測試文檔**: `backend/API_TESTING.md`
- **遷移計劃**: `MIGRATION_PLAN.md`
- **快速開始**: `QUICK_START.md`

---

## 💡 額外建議

### 功能增強（可選）
1. **搜索歷史功能**
   - 使用 AsyncStorage 保存
   - 顯示最近 10 條搜索
   - 支持清除

2. **搜索結果高亮**
   - 高亮匹配的關鍵字
   - 提升用戶體驗

3. **熱門搜索**
   - 顯示當前熱門搜索詞
   - 快速搜索入口

### 性能監控（建議）
1. 添加 API 響應時間統計
2. 添加錯誤日誌收集
3. 監控內存使用情況

---

**祝下次開發順利！** 🚀
