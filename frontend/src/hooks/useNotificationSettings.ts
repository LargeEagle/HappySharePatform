import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notification.service';
import type { NotificationSettings } from '../types/notification';

/**
 * 通知設定 Hook
 */
export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 載入設定
   */
  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const loadedSettings = await notificationService.getSettings();
      setSettings(loadedSettings);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入設定失敗');
      console.error('載入通知設定失敗:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 初始載入
   */
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  /**
   * 更新設定
   */
  const updateSettings = useCallback(
    async (newSettings: Partial<NotificationSettings>) => {
      try {
        setIsSaving(true);
        const updatedSettings = await notificationService.updateSettings(newSettings);
        setSettings(updatedSettings);
        setError(null);
        return updatedSettings;
      } catch (err) {
        setError(err instanceof Error ? err.message : '更新設定失敗');
        console.error('更新通知設定失敗:', err);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  /**
   * 切換單個設定
   */
  const toggleSetting = useCallback(
    async (key: keyof NotificationSettings) => {
      if (!settings) return;

      const newValue = !settings[key];
      await updateSettings({ [key]: newValue });
    },
    [settings, updateSettings]
  );

  return {
    settings,
    isLoading,
    isSaving,
    error,
    updateSettings,
    toggleSetting,
    refresh: loadSettings,
  };
};
