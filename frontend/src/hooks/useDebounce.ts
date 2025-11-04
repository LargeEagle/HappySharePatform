// HAPPY SHARE - useDebounce Hook
// 用於延遲執行快速變化的值，減少不必要的 API 調用

import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * 
 * 將快速變化的值延遲更新，常用於搜索輸入防抖
 * 
 * @param value - 需要防抖的值
 * @param delay - 延遲時間（毫秒），默認 500ms
 * @returns 防抖後的值
 * 
 * @example
 * ```typescript
 * const [searchQuery, setSearchQuery] = useState('');
 * const debouncedQuery = useDebounce(searchQuery, 500);
 * 
 * useEffect(() => {
 *   if (debouncedQuery) {
 *     // 執行搜索 API 調用
 *     searchAPI(debouncedQuery);
 *   }
 * }, [debouncedQuery]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 設置延遲更新的定時器
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函數：在值變化或組件卸載時清除定時器
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
