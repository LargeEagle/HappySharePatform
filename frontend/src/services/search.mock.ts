/**
 * 搜尋功能的模擬數據
 * 用於前端測試，不依賴後端API
 */

import { Post } from '../types/post';
import { User } from '../types/auth';

// 簡化的類型定義（避免循環依賴）
interface Tag {
  id: string;
  name: string;
  slug: string;
  postsCount: number;
  createdAt: string;
}

interface Attachment {
  id: string;
  url: string;
  type: string;
}

export interface SearchResult {
  posts: any[];
  users: any[];
  files: any[];
  tags: any[];
}

/**
 * 模擬文章數據
 */
export const mockPosts: any[] = [
  {
    id: 'mock-post-1',
    title: 'TypeScript 最佳實踐',
    content: '整理了一些 TypeScript 的最佳實踐：\n\n1. 善用 interface 和 type\n2. 避免使用 any\n3. 利用泛型增加代碼重用性\n4. 使用嚴格模式\n\n寫類型安全的代碼真的能減少很多 bug！',
    author: {
      id: 'user-david',
      username: 'david',
      avatar: null,
    },
    likes: 15,
    comments: 3,
    createdAt: '2025-10-29T10:00:00Z',
    updatedAt: '2025-10-29T10:00:00Z',
    images: [],
  },
  {
    id: 'mock-post-2',
    title: '學習 React Native 的心得分享',
    content: '最近開始學習 React Native，發現用 Expo 真的很方便。可以同時開發 iOS 和 Android 應用，而且熱重載功能讓開發效率大大提升。\n\n如果你也想學習移動應用開發，推薦從 React Native 開始！',
    author: {
      id: 'user-david',
      username: 'david',
      avatar: null,
    },
    likes: 8,
    comments: 2,
    createdAt: '2025-10-28T14:30:00Z',
    updatedAt: '2025-10-28T14:30:00Z',
    images: [],
  },
];

/**
 * 模擬用戶數據
 */
export const mockUsers: any[] = [
  {
    id: 'user-david',
    email: 'david@example.com',
    username: 'david',
    name: 'David Chen',
    role: 'user',
    avatar: null,
    bio: '全端工程師，熱愛 TypeScript 和 React',
    stats: {
      postsCount: 25,
      followersCount: 120,
      followingCount: 80,
      likesCount: 350,
    },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2025-10-29T00:00:00Z',
  },
  {
    id: 'user-alice',
    email: 'alice@example.com',
    username: 'alice',
    name: 'Alice Wang',
    role: 'user',
    avatar: null,
    bio: '喜歡分享生活與旅行',
    stats: {
      postsCount: 18,
      followersCount: 95,
      followingCount: 60,
      likesCount: 200,
    },
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2025-10-29T00:00:00Z',
  },
];

/**
 * 模擬標籤數據
 */
export const mockTags: any[] = [
  {
    id: 'tag-1',
    name: '程式設計',
    slug: 'programming',
    postsCount: 45,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tag-2',
    name: 'TypeScript',
    slug: 'typescript',
    postsCount: 28,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tag-3',
    name: 'ReactNative',
    slug: 'react-native',
    postsCount: 15,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

/**
 * 根據搜尋類型返回對應的模擬數據
 */
export const getMockSearchResults = (
  query: string,
  type: 'posts' | 'users' | 'tags' | 'files' | 'all'
): SearchResult => {
  const lowerQuery = query.toLowerCase();

  // 簡單的關鍵字過濾
  const filteredPosts = mockPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery) ||
      post.author.username.toLowerCase().includes(lowerQuery)
  );

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(lowerQuery) ||
      user.name.toLowerCase().includes(lowerQuery) ||
      user.bio?.toLowerCase().includes(lowerQuery)
  );

  const filteredTags = mockTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(lowerQuery) ||
      tag.slug.toLowerCase().includes(lowerQuery)
  );

  // 根據類型返回對應結果
  switch (type) {
    case 'posts':
      return {
        posts: filteredPosts,
        users: [],
        files: [],
        tags: [],
      };
    case 'users':
      return {
        posts: [],
        users: filteredUsers,
        files: [],
        tags: [],
      };
    case 'tags':
      return {
        posts: [],
        users: [],
        files: [],
        tags: filteredTags,
      };
    case 'all':
    case 'files':
    default:
      return {
        posts: filteredPosts,
        users: filteredUsers,
        files: [],
        tags: filteredTags,
      };
  }
};
