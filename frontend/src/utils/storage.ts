import AsyncStorage from '@react-native-async-storage/async-storage';
import { appConfig } from '../config/app.config';

export interface AuthStorage {
  token: string;
  refreshToken: string;
  expiration: number;
}

export const authStorage = {
  async saveAuth(auth: AuthStorage): Promise<void> {
    try {
      const promises = [
        AsyncStorage.setItem(appConfig.auth.tokenKey, auth.token),
        AsyncStorage.setItem(appConfig.auth.refreshTokenKey, auth.refreshToken),
        AsyncStorage.setItem(appConfig.auth.expirationKey, auth.expiration.toString()),
      ];
      await Promise.all(promises);
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw new Error('Failed to save authentication data');
    }
  },

  async getAuth(): Promise<AuthStorage | null> {
    try {
      const [token, refreshToken, expiration] = await Promise.all([
        AsyncStorage.getItem(appConfig.auth.tokenKey),
        AsyncStorage.getItem(appConfig.auth.refreshTokenKey),
        AsyncStorage.getItem(appConfig.auth.expirationKey),
      ]);

      if (!token || !refreshToken || !expiration) {
        return null;
      }

      return {
        token,
        refreshToken,
        expiration: parseInt(expiration, 10),
      };
    } catch (error) {
      console.error('Error getting auth data:', error);
      return null;
    }
  },

  async removeAuth(): Promise<void> {
    try {
      const keys = [
        appConfig.auth.tokenKey,
        appConfig.auth.refreshTokenKey,
        appConfig.auth.expirationKey,
      ];
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error removing auth data:', error);
      throw new Error('Failed to remove authentication data');
    }
  },

  async isTokenExpired(): Promise<boolean> {
    const auth = await this.getAuth();
    if (!auth) return true;
    return Date.now() >= auth.expiration;
  },
};