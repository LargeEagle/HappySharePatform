import { UserRole } from '../types/auth';

interface TestAccount {
  email: string;
  password: string;
  username: string;
  role: UserRole;
}

interface TestAccounts {
  admin: TestAccount;
  user: TestAccount;
  demo: TestAccount;
}

interface AppConfig {
  dev: {
    useDummyData: boolean;
  };
  api: {
    baseUrl: string;
    timeout: number;
  };
  auth: {
    tokenKey: string;
    refreshTokenKey: string;
    expirationKey: string;
  };
  theme: {
    light: {
      background: string;
      surface: string;
      primary: string;
      secondary: string;
      accent: string;
      success: string;
      warning: string;
      error: string;
      text: {
        primary: string;
        secondary: string;
        tertiary: string;
      };
      gray: {
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
      };
    };
    dark: {
      background: string;
      surface: string;
      primary: string;
      secondary: string;
      accent: string;
      success: string;
      warning: string;
      error: string;
      text: {
        primary: string;
        secondary: string;
        tertiary: string;
      };
      gray: {
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
      };
    };
  };
  validation: {
    username: {
      minLength: number;
      maxLength: number;
    };
    password: {
      minLength: number;
      maxLength: number;
      requireSpecialChar: boolean;
      requireNumber: boolean;
    };
    email: {
      pattern: RegExp;
    };
  };
}

const devConfig: AppConfig = {
  dev: {
    useDummyData: true, // 開發期間使用模擬數據
  },
  api: {
    baseUrl: 'http://localhost:3000',
    timeout: 10000,
  },
  auth: {
    tokenKey: '@app:auth:token',
    refreshTokenKey: '@app:auth:refreshToken',
    expirationKey: '@app:auth:expiration',
  },
  theme: {
    light: {
      background: '#FFFFFF',
      surface: '#F2F2F7',
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#007AFF',
      success: '#34C759',
      warning: '#FF9500',
      error: '#FF3B30',
      text: {
        primary: '#000000',
        secondary: '#3C3C43',
        tertiary: '#787880'
      },
      gray: {
        100: '#F5F5F5',
        200: '#EEEEEE',
        300: '#E0E0E0',
        400: '#BDBDBD',
        500: '#9E9E9E'
      }
    },
    dark: {
      background: '#000000',
      surface: '#1C1C1E',
      primary: '#FFFFFF',
      secondary: '#000000',
      accent: '#0A84FF',
      success: '#30D158',
      warning: '#FF9F0A',
      error: '#FF453A',
      text: {
        primary: '#FFFFFF',
        secondary: '#EBEBF5',
        tertiary: '#EBEBF599'
      },
      gray: {
        100: '#1C1C1E',
        200: '#2C2C2E',
        300: '#3A3A3C',
        400: '#48484A',
        500: '#636366'
      }
    }
  },
  validation: {
    username: {
      minLength: 3,
      maxLength: 20,
    },
    password: {
      minLength: 8,
      maxLength: 50,
      requireSpecialChar: true,
      requireNumber: true,
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },
};

const prodConfig: AppConfig = {
  ...devConfig,
  api: {
    ...devConfig.api,
    baseUrl: 'https://api.yourapp.com', // Replace with actual production API URL
  },
};

// Export the appropriate configuration based on environment
export const appConfig = __DEV__ ? devConfig : prodConfig;

// Test Account Configuration
export const testAccounts = {
  admin: {
    email: 'admin@happyshare.test',
    password: 'Admin@123',
    username: 'Admin',
    role: 'admin'
  },
  user: {
    email: 'user@happyshare.test',
    password: 'User@123',
    username: 'TestUser',
    role: 'user'
  },
  demo: {
    email: 'demo@happyshare.test',
    password: 'Demo@123',
    username: 'DemoUser',
    role: 'user'
  }
};