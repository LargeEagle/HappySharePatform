import { User } from '../types/auth';
import { Post } from '../types/post';

// 模擬用戶數據
export const dummyUsers: Record<string, User> = {
  '1': {
    id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: '熱愛分享生活的點點滴滴 🌟',
    location: '台北市',
    website: 'https://johndoe.com',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
    stats: {
      postsCount: 42,
      followersCount: 1234,
      followingCount: 567,
      likesCount: 890,
    },
  },
  '2': {
    id: '2',
    username: 'jane_smith',
    email: 'jane@example.com',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: '攝影愛好者 📷 | 旅行中',
    location: '高雄市',
    website: 'https://janesmith.blog',
    createdAt: new Date('2024-02-20').toISOString(),
    updatedAt: new Date('2024-02-20').toISOString(),
    stats: {
      postsCount: 89,
      followersCount: 2345,
      followingCount: 432,
      likesCount: 1567,
    },
  },
  '3': {
    id: '3',
    username: 'alex_chen',
    email: 'alex@example.com',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: '科技宅 💻 | 咖啡成癮者 ☕',
    location: '台中市',
    createdAt: new Date('2024-03-10').toISOString(),
    updatedAt: new Date('2024-03-10').toISOString(),
    stats: {
      postsCount: 156,
      followersCount: 3456,
      followingCount: 234,
      likesCount: 2345,
    },
  },
};

// 模擬貼文數據
export const dummyPosts: Post[] = [
  {
    id: '1',
    title: '今天天氣真好',
    content: '今天天氣真好！☀️ 適合出去走走',
    images: ['https://picsum.photos/600/400?random=1'],
    author: dummyUsers['1'],
    likes: 42,
    comments: 8,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date('2024-10-27T10:30:00').toISOString(),
    updatedAt: new Date('2024-10-27T10:30:00').toISOString(),
  },
  {
    id: '2',
    title: '夕陽美景',
    content: '剛拍的夕陽 🌅 美到不行！\n\n#攝影 #sunset',
    images: [
      'https://picsum.photos/600/400?random=2',
      'https://picsum.photos/600/400?random=3',
    ],
    author: dummyUsers['2'],
    likes: 156,
    comments: 23,
    isLiked: true,
    isBookmarked: false,
    createdAt: new Date('2024-10-27T09:15:00').toISOString(),
    updatedAt: new Date('2024-10-27T09:15:00').toISOString(),
  },
  {
    id: '3',
    title: 'TypeScript 技巧分享',
    content: '分享一個很棒的程式設計技巧 💡\n\n使用 TypeScript 的時候記得善用類型推導，可以讓代碼更簡潔！',
    author: dummyUsers['3'],
    likes: 89,
    comments: 15,
    isLiked: true,
    isBookmarked: true,
    createdAt: new Date('2024-10-27T08:00:00').toISOString(),
    updatedAt: new Date('2024-10-27T08:00:00').toISOString(),
  },
  {
    id: '4',
    title: '週末愉快',
    content: '週末愉快！🎉 大家有什麼計劃嗎？',
    author: dummyUsers['1'],
    likes: 34,
    comments: 12,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date('2024-10-26T18:45:00').toISOString(),
    updatedAt: new Date('2024-10-26T18:45:00').toISOString(),
  },
  {
    id: '5',
    title: '咖啡拉花練習',
    content: '今天的咖啡拉花 ☕️\n\n練習了很久終於成功了！',
    images: ['https://picsum.photos/600/400?random=4'],
    author: dummyUsers['3'],
    likes: 67,
    comments: 9,
    isLiked: false,
    isBookmarked: true,
    createdAt: new Date('2024-10-26T14:20:00').toISOString(),
    updatedAt: new Date('2024-10-26T14:20:00').toISOString(),
  },
  {
    id: '6',
    title: '新餐廳推薦',
    content: '推薦這家新開的餐廳 🍜\n位置在市中心，環境很棒，食物也很美味！',
    images: [
      'https://picsum.photos/600/400?random=5',
      'https://picsum.photos/600/400?random=6',
      'https://picsum.photos/600/400?random=7',
    ],
    author: dummyUsers['2'],
    likes: 123,
    comments: 34,
    isLiked: true,
    isBookmarked: false,
    createdAt: new Date('2024-10-26T12:00:00').toISOString(),
    updatedAt: new Date('2024-10-26T12:00:00').toISOString(),
  },
  {
    id: '7',
    title: 'React Native 開發心得',
    content: '學習筆記分享 📝\n\nReact Native 開發心得：\n1. 善用 hooks\n2. 注意性能優化\n3. 多寫可重用的組件',
    author: dummyUsers['3'],
    likes: 201,
    comments: 45,
    isLiked: true,
    isBookmarked: true,
    createdAt: new Date('2024-10-25T16:30:00').toISOString(),
    updatedAt: new Date('2024-10-25T16:30:00').toISOString(),
  },
  {
    id: '8',
    title: '早安問候',
    content: '早安！新的一天開始了 🌤️',
    author: dummyUsers['1'],
    likes: 28,
    comments: 5,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date('2024-10-25T07:00:00').toISOString(),
    updatedAt: new Date('2024-10-25T07:00:00').toISOString(),
  },
];

// 模擬評論數據
export const dummyComments: Record<string, Array<{
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}>> = {
  '1': [
    {
      id: '1',
      content: '真的！我也想出去走走',
      author: {
        id: dummyUsers['2'].id,
        username: dummyUsers['2'].username,
        avatar: dummyUsers['2'].avatar,
      },
      createdAt: new Date('2024-10-27T10:35:00').toISOString(),
      likes: 5,
      isLiked: false,
    },
    {
      id: '2',
      content: '有推薦的地方嗎？',
      author: {
        id: dummyUsers['3'].id,
        username: dummyUsers['3'].username,
        avatar: dummyUsers['3'].avatar,
      },
      createdAt: new Date('2024-10-27T10:40:00').toISOString(),
      likes: 2,
      isLiked: false,
    },
  ],
  '2': [
    {
      id: '3',
      content: '太美了！🤩',
      author: {
        id: dummyUsers['1'].id,
        username: dummyUsers['1'].username,
        avatar: dummyUsers['1'].avatar,
      },
      createdAt: new Date('2024-10-27T09:20:00').toISOString(),
      likes: 8,
      isLiked: true,
    },
    {
      id: '4',
      content: '這是在哪裡拍的？',
      author: {
        id: dummyUsers['3'].id,
        username: dummyUsers['3'].username,
        avatar: dummyUsers['3'].avatar,
      },
      createdAt: new Date('2024-10-27T09:25:00').toISOString(),
      likes: 3,
      isLiked: false,
    },
  ],
  '3': [
    {
      id: '5',
      content: '感謝分享！很實用',
      author: {
        id: dummyUsers['1'].id,
        username: dummyUsers['1'].username,
        avatar: dummyUsers['1'].avatar,
      },
      createdAt: new Date('2024-10-27T08:15:00').toISOString(),
      likes: 12,
      isLiked: false,
    },
  ],
};

// 模擬延遲（模擬網路請求）
export const delay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// 獲取當前登入用戶
export const getCurrentUser = (): User => dummyUsers['1'];
