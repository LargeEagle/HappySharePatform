import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { LoginCredentials, RegisterCredentials, User } from '../types/auth';
import { authService } from '../services/auth.service';
import { validateUsername, validatePassword, validateEmail } from '../utils/validation';
import { authStorage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string; user?: User; token?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await authStorage.getAuth();
        if (auth?.token) {
          const user = await authService.getCurrentUser();
          setUser(user);
          setToken(auth.token);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        await authStorage.removeAuth();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const emailValidation = validateEmail(credentials.email);
      const passwordValidation = validatePassword(credentials.password);

      if (!emailValidation.isValid) {
        const error = emailValidation.error || '無效的電子郵件';
        setError(error);
        return { success: false, error };
      }

      if (!passwordValidation.isValid) {
        const error = passwordValidation.error || '無效的密碼';
        setError(error);
        return { success: false, error };
      }

      const response = await authService.login(credentials);
      
      if (!response || !response.token) {
        const error = '登入失敗：伺服器回應無效';
        setError(error);
        return { success: false, error };
      }

      setUser(response.user);
      setToken(response.token);

      await authStorage.saveAuth({
        token: response.token,
        refreshToken: response.refreshToken,
        expiration: response.expiration
      });

      return {
        success: true,
        user: response.user,
        token: response.token
      };
    } catch (err) {
      const error = err instanceof Error ? err.message : '登入失敗';
      setError(error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const usernameValidation = validateUsername(credentials.username);
      const emailValidation = validateEmail(credentials.email);
      const passwordValidation = validatePassword(credentials.password);

      if (!usernameValidation.isValid) {
        const error = usernameValidation.error || '無效的用戶名';
        setError(error);
        return { success: false, error };
      }

      if (!emailValidation.isValid) {
        const error = emailValidation.error || '無效的電子郵件';
        setError(error);
        return { success: false, error };
      }

      if (!passwordValidation.isValid) {
        const error = passwordValidation.error || '無效的密碼';
        setError(error);
        return { success: false, error };
      }

      await authService.register(credentials);
      return { success: true };
    } catch (err) {
      const error = err instanceof Error ? err.message : '註冊失敗';
      setError(error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setToken(null);
      await authStorage.removeAuth();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};