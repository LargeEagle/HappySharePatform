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
    // TODO: 替換為實際的API調用
    // const response = await axios.post(`${API_URL}/auth/login`, credentials);
    // return response.data;
    
    console.log('Attempting login with credentials:', credentials);
    
    // 模擬API響應，檢查測試帳號
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // 檢查測試帳號
          console.log('Available test accounts:', testAccounts);
          
          const testAccount = Object.entries(testAccounts).find(
            ([_, account]) => account.email === credentials.email
          );
          
          console.log('Found test account:', testAccount);
          
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
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    // TODO: 替換為實際的API調用
    // const response = await axios.post(`${API_URL}/auth/register`, credentials);
    // return response.data;
    
    // 模擬API響應
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(createMockAuthResponse({
          email: credentials.email,
          username: credentials.username,
        }));
      }, 1000);
    });
  },

  async logout(): Promise<void> {
    // TODO: 替換為實際的API調用
    // await axios.post(`${API_URL}/auth/logout`);
    return Promise.resolve();
  },

  async getCurrentUser(): Promise<User> {
    // TODO: 替換為實際的API調用
    // const response = await axios.get(`${API_URL}/auth/me`);
    // return response.data;
    
    // 模擬API響應
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }, 1000);
    });
  },
};