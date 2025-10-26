import { appConfig } from '../config/app.config';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return { isValid: false, error: '用戶名不能為空' };
  }

  if (username.length < appConfig.validation.username.minLength) {
    return {
      isValid: false,
      error: `用戶名至少需要 ${appConfig.validation.username.minLength} 個字符`,
    };
  }

  if (username.length > appConfig.validation.username.maxLength) {
    return {
      isValid: false,
      error: `用戶名不能超過 ${appConfig.validation.username.maxLength} 個字符`,
    };
  }

  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: '密碼不能為空' };
  }

  if (password.length < appConfig.validation.password.minLength) {
    return {
      isValid: false,
      error: `密碼至少需要 ${appConfig.validation.password.minLength} 個字符`,
    };
  }

  if (password.length > appConfig.validation.password.maxLength) {
    return {
      isValid: false,
      error: `密碼不能超過 ${appConfig.validation.password.maxLength} 個字符`,
    };
  }

  if (appConfig.validation.password.requireNumber && !/\d/.test(password)) {
    return { isValid: false, error: '密碼必須包含至少一個數字' };
  }

  if (appConfig.validation.password.requireSpecialChar && !/[!@#$%^&*]/.test(password)) {
    return { isValid: false, error: '密碼必須包含至少一個特殊字符 (!@#$%^&*)' };
  }

  return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: '電子郵件不能為空' };
  }

  if (!appConfig.validation.email.pattern.test(email)) {
    return { isValid: false, error: '請輸入有效的電子郵件地址' };
  }

  return { isValid: true };
};