export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  author: User;
  images?: string[];
  youtubeUrl?: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  status: 'published' | 'draft' | 'hidden';
  commentsEnabled: boolean;
  likesVisible: boolean;
}