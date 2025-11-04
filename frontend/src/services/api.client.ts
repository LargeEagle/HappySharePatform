import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { appConfig } from '../config/app.config';
import { authStorage } from '../utils/storage';

/**
 * API 客戶端配置
 * 統一管理所有 HTTP 請求
 * 
 * 修復: 2025-11-02 - 使用延遲初始化避免模塊加載時的問題
 */
class ApiClient {
  private client: AxiosInstance | null = null;

  /**
   * 獲取或創建 axios 實例（延遲初始化）
   */
  private getClient(): AxiosInstance {
    if (!this.client) {
      this.client = axios.create({
        baseURL: appConfig.api.baseUrl,
        timeout: appConfig.api.timeout,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.setupInterceptors();
    }
    return this.client;
  }

  /**
   * 設置請求和響應攔截器
   */
  private setupInterceptors(): void {
    if (!this.client) return;

    // 請求攔截器：自動添加認證 token
    this.client.interceptors.request.use(
      async (config) => {
        const auth = await authStorage.getAuth();
        if (auth?.token) {
          config.headers.Authorization = `Bearer ${auth.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 響應攔截器：統一錯誤處理
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token 過期，清除認證信息
          await authStorage.removeAuth();
          // 可以在這裡觸發重新登入流程
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET 請求
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.getClient().get(url, config);
    return response.data;
  }

  /**
   * POST 請求
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.getClient().post(url, data, config);
    return response.data;
  }

  /**
   * PUT 請求
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.getClient().put(url, data, config);
    return response.data;
  }

  /**
   * DELETE 請求
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.getClient().delete(url, config);
    return response.data;
  }

  /**
   * PATCH 請求
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.getClient().patch(url, data, config);
    return response.data;
  }
}

// 導出單例
export const apiClient = new ApiClient();
