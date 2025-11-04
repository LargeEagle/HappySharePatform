// HAPPY SHARE - 搜尋畫面

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { searchService } from '../services';
import { searchConfig } from '../config/search.config';
import { getMockSearchResults } from '../services/search.mock';
import type { 
  SearchType, 
  SearchSuggestion, 
  SearchHistoryItem, 
  Tag, 
  Attachment 
} from '../types/search';
import type { Post } from '../types/post';
import type { User } from '../types/auth';
import { PostCard } from '../components/common/PostCard';
import { FileCard } from '../components/common/FileCard';
import { useTheme } from '../hooks/useTheme';
import { useDebounce } from '../hooks/useDebounce';

// 暫時移除 'all' 和 'files'，避免後端連接池問題
// 更新時間: 2025-11-02
type TabType = 'posts' | 'users' | 'tags';

interface SearchState {
  query: string;
  activeTab: TabType;
  results: {
    posts: Post[];
    users: User[];
    files: Attachment[];
    tags: Tag[];
  };
  suggestions: SearchSuggestion[];
  history: SearchHistoryItem[];
  loading: boolean;
  showSuggestions: boolean;
}

export const SearchScreen: React.FC = () => {
  console.log('[SearchScreen] ========== COMPONENT FUNCTION CALLED ==========');
  console.log('[SearchScreen] Component mounted/re-rendered');
  
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  // 用於取消請求的 AbortController ref
  const abortControllerRef = useRef<AbortController | null>(null);

  const [state, setState] = useState<SearchState>({
    query: '',
    activeTab: 'posts',  // 默認改為 'posts'
    results: { posts: [], users: [], files: [], tags: [] },
    suggestions: [],
    history: [],
    loading: false,
    showSuggestions: false,
  });
  
  console.log('[SearchScreen] Current state:', {
    query: state.query,
    activeTab: state.activeTab,
    resultsKeys: Object.keys(state.results || {}),
    loading: state.loading,
    showSuggestions: state.showSuggestions
  });

  // 使用 debounce 延遲搜索建議請求（500ms）
  const debouncedQuery = useDebounce(state.query, 500);

  // 載入搜尋歷史
  useEffect(() => {
    console.log('[SearchScreen] useEffect: loadSearchHistory called');
    loadSearchHistory();
  }, []);

  // 🔍 自動搜尋：當 debouncedQuery 改變時自動執行搜尋
  useEffect(() => {
    console.log('[SearchScreen] useEffect: debouncedQuery changed:', debouncedQuery);
    
    // 取消之前的請求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (debouncedQuery.length >= 2) {
      // 創建新的 AbortController
      abortControllerRef.current = new AbortController();
      
      // 載入搜尋建議（背景執行）
      loadSuggestions(abortControllerRef.current.signal);
      
      // ✨ 自動執行搜尋
      console.log('[SearchScreen] 🔍 Auto-search triggered for:', debouncedQuery);
      
      const executeSearch = async () => {
        console.log('[SearchScreen] Setting loading state...');
        setState((prev) => ({ ...prev, loading: true, showSuggestions: false }));

        try {
          const searchType: SearchType = state.activeTab;
          let newResults;
          
          if (searchConfig.useMockData) {
            console.log('[SearchScreen] 🧪 Using MOCK data');
            
            // 模擬 API 延遲
            await new Promise(resolve => setTimeout(resolve, searchConfig.mockDelay));
            
            // 使用模擬數據
            newResults = getMockSearchResults(debouncedQuery, searchType);
            console.log('[SearchScreen] Mock search results:', newResults);
          } else {
            console.log('[SearchScreen] 📡 Using REAL API');
            
            // 調用真實 API
            const response = await searchService.search({
              query: debouncedQuery,
              type: searchType,
            });
            
            newResults = response;
            console.log('[SearchScreen] API search results:', newResults);
          }

          console.log('[SearchScreen] Results summary:', {
            posts: newResults.posts?.length || 0,
            users: newResults.users?.length || 0,
            tags: newResults.tags?.length || 0,
          });

          setState((prev) => ({
            ...prev,
            results: {
              posts: newResults.posts || [],
              users: newResults.users || [],
              files: newResults.files || [],
              tags: newResults.tags || [],
            },
            loading: false,
          }));

          console.log('[SearchScreen] Search completed successfully');
        } catch (error) {
          console.error('[SearchScreen] Search error:', error);
          setState((prev) => ({
            ...prev,
            results: { posts: [], users: [], files: [], tags: [] },
            loading: false,
          }));
        }
      };
      
      executeSearch();
    } else {
      setState((prev) => ({ 
        ...prev, 
        suggestions: [], 
        showSuggestions: false,
        results: { posts: [], users: [], files: [], tags: [] }
      }));
    }

    // 清理函數
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery, state.activeTab]);

  const loadSearchHistory = async () => {
    try {
      const history = await searchService.getHistory();
      setState((prev) => ({ ...prev, history }));
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  };

  const loadSuggestions = async (signal?: AbortSignal) => {
    try {
      const suggestions = await searchService.getSuggestions(debouncedQuery, signal);
      
      // 檢查請求是否被取消
      if (signal?.aborted) {
        return;
      }
      
      setState((prev) => ({
        ...prev,
        suggestions,
        showSuggestions: suggestions.length > 0,
      }));
    } catch (error: any) {
      // 忽略取消請求的錯誤
      if (error.name === 'AbortError' || error.name === 'CanceledError') {
        return;
      }
      
      console.error('Failed to load suggestions:', error);
      setState((prev) => ({ ...prev, suggestions: [], showSuggestions: false }));
    }
  };

  const handleSearch = async (searchQuery?: string) => {
    const query = searchQuery || state.query;
    console.log('[SearchScreen] handleSearch called, query:', query, 'activeTab:', state.activeTab);
    
    if (!query.trim()) {
      console.log('[SearchScreen] Query is empty, skipping search');
      return;
    }

    console.log('[SearchScreen] Setting loading state');
    setState((prev) => ({ ...prev, loading: true, showSuggestions: false }));

    try {
      const searchType: SearchType = state.activeTab;
      let newResults;
      
      // 📝 根據配置決定使用模擬數據還是真實API
      // 在 frontend/src/config/search.config.ts 中修改 useMockData
      if (searchConfig.useMockData) {
        console.log('[SearchScreen] 🧪 Using MOCK data (search.config.ts: useMockData=true)');
        
        // 模擬 API 延遲
        await new Promise(resolve => setTimeout(resolve, searchConfig.mockDelay));
        
        // 使用模擬數據模塊
        newResults = getMockSearchResults(query, searchType);
        console.log('[SearchScreen] Mock results:', newResults);
      } else {
        console.log('[SearchScreen] 📡 Using REAL API (search.config.ts: useMockData=false)');
        
        // 調用真實 API
        const response = await searchService.search({
          query,
          type: searchType,
        });
        
        newResults = response;
        console.log('[SearchScreen] API results:', newResults);
      }

      console.log('[SearchScreen] Results summary:', {
        posts: newResults.posts?.length || 0,
        users: newResults.users?.length || 0,
        tags: newResults.tags?.length || 0,
      });

      setState((prev) => ({
        ...prev,
        results: {
          posts: newResults.posts || [],
          users: newResults.users || [],
          files: newResults.files || [],
          tags: newResults.tags || [],
        },
        loading: false,
      }));

      console.log('[SearchScreen] State updated successfully');
      
      // TODO: 實現保存搜尋歷史功能
      // saveToHistory({ query, type: state.activeTab });
    } catch (error) {
      console.error('[SearchScreen] Search error:', error);
      setState((prev) => ({
        ...prev,
        results: { posts: [], users: [], files: [], tags: [] },
        loading: false,
      }));
    }
  };

  // 🔍 自動執行搜尋：當 debounced query 改變且長度 >= 2 時自動搜尋
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      console.log('[SearchScreen] Auto-executing search for:', debouncedQuery);
      handleSearch(debouncedQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const handleSuggestionPress = (suggestion: SearchSuggestion) => {
    setState((prev) => ({ ...prev, query: suggestion.text, showSuggestions: false }));
    handleSearch(suggestion.text);
  };

  const handleHistoryPress = (item: SearchHistoryItem) => {
    setState((prev) => ({ 
      ...prev, 
      query: item.query,
      activeTab: item.type as TabType,
    }));
    handleSearch(item.query);
  };

  const handleTabChange = (tab: TabType) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
    // 如果有查詢文本，立即重新搜索
    if (state.query.trim()) {
      // 使用 setTimeout 確保 state 更新後再搜索
      setTimeout(() => {
        handleSearch();
      }, 0);
    }
  };

  const renderSearchBar = () => (
    <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
      <Ionicons name="search" size={20} color={theme.colors.onSurface} />
      <TextInput
        style={[styles.searchInput, { color: theme.colors.onSurface }]}
        placeholder="搜尋文章、用戶、標籤..."
        placeholderTextColor={theme.colors.onSurfaceVariant}
        value={state.query}
        onChangeText={(text) => setState((prev) => ({ ...prev, query: text }))}
        onSubmitEditing={() => {
          console.log('[SearchScreen] onSubmitEditing triggered');
          handleSearch();
        }}
        returnKeyType="search"
      />
      {state.query.length > 0 ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity 
            onPress={() => {
              console.log('[SearchScreen] Search button clicked');
              handleSearch();
            }}
            style={{ padding: 4 }}
          >
            <Ionicons name="search-outline" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setState((prev) => ({ ...prev, query: '' }))}>
            <Ionicons name="close-circle" size={20} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );

  const renderTabs = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.tabsContainer}
    >
      {/* 暫時移除 'all' 和 'files' */}
      {(['posts', 'users', 'tags'] as TabType[]).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            state.activeTab === tab && { 
              backgroundColor: theme.colors.primary,
            },
          ]}
          onPress={() => handleTabChange(tab)}
        >
          <Text
            style={[
              styles.tabText,
              { color: state.activeTab === tab ? '#fff' : theme.colors.onSurface },
            ]}
          >
            {getTabLabel(tab)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const getTabLabel = (tab: TabType): string => {
    const labels = {
      // all: '全部',  // 暫時移除
      posts: '文章',
      users: '用戶',
      // files: '檔案',  // 暫時移除
      tags: '標籤',
    };
    return labels[tab];
  };

  const renderSuggestions = () => (
    <View style={[styles.suggestionsContainer, { backgroundColor: theme.colors.surface }]}>
      {state.suggestions.map((suggestion, index) => {
        // 根据类型选择图标
        let iconName: keyof typeof Ionicons.glyphMap = 'search';
        if (suggestion.type === 'tag') {
          iconName = 'pricetag';
        } else if (suggestion.type === 'user') {
          iconName = 'person';
        } else if (suggestion.type === 'post') {
          iconName = 'document-text';
        }

        return (
          <TouchableOpacity
            key={index}
            style={styles.suggestionItem}
            onPress={() => handleSuggestionPress(suggestion)}
          >
            <Ionicons
              name={iconName}
              size={18}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={[styles.suggestionText, { color: theme.colors.onSurface }]}>
              {suggestion.text}
            </Text>
            {suggestion.count !== undefined && (
              <Text style={[styles.suggestionCount, { color: theme.colors.onSurfaceVariant }]}>
                {suggestion.count}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderHistory = () => (
    <View style={styles.historyContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>最近搜尋</Text>
      {state.history.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.historyItem}
          onPress={() => handleHistoryPress(item)}
        >
          <Ionicons name="time" size={18} color={theme.colors.onSurfaceVariant} />
          <Text style={[styles.historyText, { color: theme.colors.onSurface }]}>
            {item.query}
          </Text>
          <Text style={[styles.historyType, { color: theme.colors.onSurfaceVariant }]}>
            {getTabLabel(item.type as TabType)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderEmptyState = (message: string) => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color={theme.colors.onSurfaceVariant} />
      <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
        {message}
      </Text>
      <Text style={[styles.emptyDescription, { color: theme.colors.onSurfaceVariant }]}>
        試試其他關鍵字
      </Text>
    </View>
  );

  const renderResults = () => {
    console.log('[SearchScreen] renderResults called');
    console.log('[SearchScreen] state.loading:', state.loading);
    console.log('[SearchScreen] state.results:', state.results);
    console.log('[SearchScreen] state.activeTab:', state.activeTab);
    
    if (state.loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
            搜尋中...
          </Text>
        </View>
      );
    }

    const { posts = [], users = [], files = [], tags = [] } = state.results || {};
    console.log('[SearchScreen] Destructured results:', { posts: posts.length, users: users.length, tags: tags.length });
    
    // 檢查是否有任何結果
    const hasResults = posts.length > 0 || users.length > 0 || files.length > 0 || tags.length > 0;
    
    // 如果已經執行過搜索但沒有結果，顯示空狀態
    if (state.query.trim() && !hasResults) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color={theme.colors.onSurfaceVariant} />
          <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
            找不到相關結果
          </Text>
          <Text style={[styles.emptyDescription, { color: theme.colors.onSurfaceVariant }]}>
            試試其他關鍵字或切換不同分類
          </Text>
        </View>
      );
    }

    // 移除 'all' 模式，直接顯示當前選中類型的結果

    if (state.activeTab === 'posts') {
      if (posts.length === 0) {
        return renderEmptyState('找不到相關文章');
      }
      return (
        <FlatList
          data={posts}
          renderItem={({ item }) => <PostCard post={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      );
    }

    if (state.activeTab === 'users') {
      if (users.length === 0) {
        return renderEmptyState('找不到相關用戶');
      }
      return (
        <FlatList
          data={users}
          renderItem={({ item }) => renderUserItem(item)}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      );
    }

    // 'files' 類型暫時移除，因為後端連接池問題

    if (state.activeTab === 'tags') {
      if (tags.length === 0) {
        return renderEmptyState('找不到相關標籤');
      }
      return (
        <ScrollView contentContainerStyle={styles.listContent}>
          <View style={styles.tagsGrid}>
            {tags.map((tag) => renderTagItem(tag))}
          </View>
        </ScrollView>
      );
    }

    return null;
  };

  const renderUserItem = (user: User) => (
    <TouchableOpacity
      key={user.id}
      style={[styles.userItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('Profile' as never, { userId: user.id } as never)}
    >
      <View style={styles.userAvatar}>
        <Text style={styles.userAvatarText}>{user.username[0].toUpperCase()}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: theme.colors.onSurface }]}>{user.name}</Text>
        <Text style={[styles.userUsername, { color: theme.colors.onSurfaceVariant }]}>
          @{user.username}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderTagItem = (tag: Tag) => (
    <TouchableOpacity
      key={tag.id}
      style={[styles.tagItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('TagPosts' as never, { slug: tag.slug } as never)}
    >
      <Text style={[styles.tagName, { color: theme.colors.onSurface }]}>#{tag.name}</Text>
      <Text style={[styles.tagCount, { color: theme.colors.onSurfaceVariant }]}>
        {tag.postsCount} 篇文章
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderSearchBar()}
      {renderTabs()}
      
      {state.showSuggestions && state.suggestions.length > 0 ? renderSuggestions() : null}
      
      {!state.query && state.history.length > 0 ? renderHistory() : null}
      
      {state.query ? renderResults() : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  suggestionsContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 15,
  },
  suggestionCount: {
    fontSize: 13,
  },
  historyContainer: {
    paddingHorizontal: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  historyText: {
    flex: 1,
    fontSize: 15,
  },
  historyType: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 15,
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
  },
  resultSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  viewMoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  viewMoreText: {
    fontSize: 15,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userUsername: {
    fontSize: 14,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  tagItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 8,
  },
  tagName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  tagCount: {
    fontSize: 12,
  },
});
