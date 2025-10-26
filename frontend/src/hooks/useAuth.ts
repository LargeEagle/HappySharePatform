import { useState, useCallback, useEffect } from 'react';
import { LoginCredentials, RegisterCredentials, User } from '../types/auth';
import { authService } from '../services/auth.service';
import { validateUsername, validatePassword, validateEmail } from '../utils/validation';
import { authStorage } from '../utils/storage';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate inputs
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

      try {
        // Save auth data
        await authStorage.saveAuth({
          token: response.token,
          refreshToken: response.refreshToken,
          expiration: response.expiration,
        });
      } catch (err) {
        console.error('Failed to save auth data:', err);
        // Continue anyway as the login was successful
      }

      return { 
        success: true,
        user: response.user,
        token: response.token
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登入失敗';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate inputs
      const emailValidation = validateEmail(credentials.email);
      const passwordValidation = validatePassword(credentials.password);
      const usernameValidation = validateUsername(credentials.username);

      if (!usernameValidation.isValid) {
        setError(usernameValidation.error || '無效的用戶名');
        return;
      }

      if (!emailValidation.isValid) {
        setError(emailValidation.error || '無效的電子郵件');
        return;
      }

      if (!passwordValidation.isValid) {
        setError(passwordValidation.error || '無效的密碼');
        return;
      }

      if (credentials.password !== credentials.confirmPassword) {
        setError('密碼不匹配');
        return;
      }

      const response = await authService.register(credentials);
      setUser(response.user);
      setToken(response.token);

      // Save auth data
      await authStorage.saveAuth({
        token: response.token,
        refreshToken: response.refreshToken,
        expiration: response.expiration,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '註冊失敗');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.logout();
      setUser(null);
      setToken(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Restore auth state from storage on mount
  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const storedAuth = await authStorage.getAuth();
        if (storedAuth && !await authStorage.isTokenExpired()) {
          // TODO: Implement token refresh if needed
          setToken(storedAuth.token);
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } else if (storedAuth) {
          // Token expired, clean up
          await authStorage.removeAuth();
        }
      } catch (err) {
        console.error('Error restoring auth state:', err);
      }
    };

    restoreAuth();
  }, []);

  return {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
  };
}