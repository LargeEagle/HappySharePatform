import axios from 'axios';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth';
import { appConfig, testAccounts } from '../config/app.config';

const API_URL = appConfig.api.baseUrl;

// Helper function to generate mock auth response
const createMockAuthResponse = (user: Partial<User>): AuthResponse => {
  const now = Date.now();
  return {
    user: {
      id: '1',
      email: user.email || 'test@example.com',
      username: user.username || 'testuser',
      role: user.role || 'user',
      avatar: user.avatar,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    token: 'dummy-token',
    refreshToken: 'dummy-refresh-token',
    expiration: now + 24 * 60 * 60 * 1000, // 24 hours from now
  };
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      if (appConfig.dev.useDummyData) {
        // 使用模擬數據
        console.log('Attempting login with credentials:', credentials);
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              const testAccount = Object.entries(testAccounts).find(
                ([_, account]) => account.email === credentials.email
              );
              
              if (testAccount && testAccount[1].password === credentials.password) {
                const response = createMockAuthResponse({
                  email: testAccount[1].email,
                  username: testAccount[1].username,
                  role: testAccount[1].role,
                });
                console.log('Login successful:', response);
                resolve(response);
              } else {
                console.log('Login failed: Invalid credentials');
                reject(new Error('Invalid credentials'));
              }
            } catch (error) {
              console.error('Login error:', error);
              reject(error);
            }
          }, 1000);
        });
      } else {
        // 調用真實 API
        console.log('🔗 Attempting to connect to:', `${API_URL}/auth/login`);
        console.log('📡 API_URL:', API_URL);
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        
        // 適配後端響應格式
        const { data } = response.data;
        return {
          user: {
            id: data.user.id,
            email: data.user.email,
            username: data.user.username,
            name: data.user.name,
            avatar: data.user.avatar,
            role: 'user', // 後端暫時沒有 role 字段
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: data.token,
          refreshToken: data.token, // 暫時使用同一個 token
          expiration: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw error;
    }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      if (appConfig.dev.useDummyData) {
        // 使用模擬數據
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(createMockAuthResponse({
              email: credentials.email,
              username: credentials.username,
            }));
          }, 1000);
        });
      } else {
        // 調用真實 API
        const response = await axios.post(`${API_URL}/auth/register`, credentials);
        
        // 適配後端響應格式
        const { data } = response.data;
        return {
          user: {
            id: data.user.id,
            email: data.user.email,
            username: data.user.username,
            name: data.user.name,
            avatar: data.user.avatar,
            role: 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: data.token,
          refreshToken: data.token,
          expiration: Date.now() + 7 * 24 * 60 * 60 * 1000,
        };
      }
    } catch (error) {
      console.error('Register error:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw error;
    }
  },

  async logout(): Promise<void> {
    // 前端只需清除本地 token
    return Promise.resolve();
  },

  async getCurrentUser(token: string): Promise<User> {
    try {
      if (appConfig.dev.useDummyData) {
        // 使用模擬數據
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              id: '1',
              email: 'test@example.com',
              username: 'testuser',
              role: 'user',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }, 1000);
        });
      } else {
        // 調用真實 API
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const { data } = response.data;
        return {
          id: data.id,
          email: data.email,
          username: data.username,
          name: data.name,
          avatar: data.avatar,
          bio: data.bio,
          role: 'user',
          createdAt: data.createdAt,
          updatedAt: new Date().toISOString(),
        };
      }
    } catch (error) {
      console.error('Get current user error:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get user info');
      }
      throw error;
    }
  },
};