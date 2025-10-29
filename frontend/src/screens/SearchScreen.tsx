// HAPPY SHARE - 搜尋畫面

import React, { useState, useEffect, useCallback } from 'react';
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

type TabType = 'all' | 'posts' | 'users' | 'files' | 'tags';

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
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [state, setState] = useState<SearchState>({
    query: '',
    activeTab: 'all',
    results: { posts: [], users: [], files: [], tags: [] },
    suggestions: [],
    history: [],
    loading: false,
    showSuggestions: false,
  });

  // 載入搜尋歷史
  useEffect(() => {
    loadSearchHistory();
  }, []);

  // 載入搜尋建議
  useEffect(() => {
    if (state.query.length >= 2) {
      loadSuggestions();
    } else {
      setState((prev) => ({ ...prev, suggestions: [], showSuggestions: false }));
    }
  }, [state.query]);

  const loadSearchHistory = async () => {
    try {
      const response = await searchService.getHistory();
      setState((prev) => ({ ...prev, history: response.data.history }));
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  };

  const loadSuggestions = async () => {
    try {
      const response = await searchService.getSuggestions(state.query);
      setState((prev) => ({
        ...prev,
        suggestions: response.data.suggestions,
        showSuggestions: true,
      }));
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const handleSearch = async (searchQuery?: string) => {
    const query = searchQuery || state.query;
    if (!query.trim()) return;

    setState((prev) => ({ ...prev, loading: true, showSuggestions: false }));

    try {
      const searchType: SearchType = state.activeTab === 'all' ? 'all' : state.activeTab;
      const response = await searchService.search({
        query,
        type: searchType,
        page: 1,
        limit: 20,
      });

      setState((prev) => ({
        ...prev,
        results: {
          posts: response.data.posts || [],
          users: response.data.users || [],
          files: response.data.files || [],
          tags: response.data.tags || [],
        },
        loading: false,
      }));

      // 重新載入歷史記錄
      loadSearchHistory();
    } catch (error) {
      console.error('Search failed:', error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

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
    if (state.query.trim()) {
      handleSearch();
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
        onSubmitEditing={() => handleSearch()}
        returnKeyType="search"
      />
      {state.query.length > 0 && (
        <TouchableOpacity onPress={() => setState((prev) => ({ ...prev, query: '' }))}>
          <Ionicons name="close-circle" size={20} color={theme.colors.onSurfaceVariant} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderTabs = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.tabsContainer}
    >
      {(['all', 'posts', 'users', 'files', 'tags'] as TabType[]).map((tab) => (
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
      all: '全部',
      posts: '文章',
      users: '用戶',
      files: '檔案',
      tags: '標籤',
    };
    return labels[tab];
  };

  const renderSuggestions = () => (
    <View style={[styles.suggestionsContainer, { backgroundColor: theme.colors.surface }]}>
      {state.suggestions.map((suggestion, index) => (
        <TouchableOpacity
          key={index}
          style={styles.suggestionItem}
          onPress={() => handleSuggestionPress(suggestion)}
        >
          <Ionicons
            name={suggestion.type === 'tag' ? 'pricetag' : 'person'}
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
      ))}
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

  const renderResults = () => {
    if (state.loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }

    const { posts, users, files, tags } = state.results;

    if (state.activeTab === 'all') {
      return (
        <ScrollView style={styles.resultsContainer}>
          {posts.length > 0 && (
            <View style={styles.resultSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>文章</Text>
              {posts.slice(0, 3).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </View>
          )}
          {users.length > 0 && (
            <View style={styles.resultSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>用戶</Text>
              {users.slice(0, 3).map((user) => renderUserItem(user))}
            </View>
          )}
          {tags.length > 0 && (
            <View style={styles.resultSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>標籤</Text>
              <View style={styles.tagsGrid}>
                {tags.slice(0, 6).map((tag) => renderTagItem(tag))}
              </View>
            </View>
          )}
        </ScrollView>
      );
    }

    if (state.activeTab === 'posts') {
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
      return (
        <FlatList
          data={users}
          renderItem={({ item }) => renderUserItem(item)}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      );
    }

    if (state.activeTab === 'files') {
      return (
        <FlatList
          data={files}
          renderItem={({ item }) => <FileCard file={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      );
    }

    if (state.activeTab === 'tags') {
      return (
        <View style={styles.tagsGrid}>
          {tags.map((tag) => renderTagItem(tag))}
        </View>
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
      
      {state.showSuggestions && state.suggestions.length > 0 && renderSuggestions()}
      
      {!state.query && state.history.length > 0 && renderHistory()}
      
      {state.query && renderResults()}
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
  resultsContainer: {
    flex: 1,
  },
  resultSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
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
