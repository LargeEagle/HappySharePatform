export type UserRole = 'admin' | 'user';

export interface UserStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  likesCount: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  stats?: UserStats;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiration: number;
}