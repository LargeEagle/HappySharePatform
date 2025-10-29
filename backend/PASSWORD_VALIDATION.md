# 密碼驗證說明

## 📋 密碼要求

為了增強帳號安全性，系統對用戶密碼實施以下要求：

### 必須包含
- ✅ 至少 8 個字符
- ✅ 至少一個大寫字母 (A-Z)
- ✅ 至少一個小寫字母 (a-z)
- ✅ 至少一個數字 (0-9)
- ✅ 至少一個特殊字符 (!@#$%^&*)

### 範例
- ✅ `Test@1234` - 有效
- ✅ `MyPass#123` - 有效
- ✅ `Secure!Pass9` - 有效
- ❌ `password` - 缺少大寫、數字和特殊字符
- ❌ `PASSWORD` - 缺少小寫、數字和特殊字符
- ❌ `Pass123` - 缺少特殊字符且長度不足
- ❌ `Pass@123` - 有效，但建議至少 8 個字符

## 🔧 實現細節

### 使用的技術
- **class-validator**: DTO 驗證裝飾器
- **class-transformer**: 自動類型轉換
- **NestJS ValidationPipe**: 全局驗證管道

### 驗證位置
```typescript
// backend/src/auth/dto/auth.dto.ts
export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: '密碼不能為空' })
  @MinLength(8, { message: '密碼至少需要 8 個字符' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
    message: '密碼必須包含至少一個大寫字母、一個小寫字母、一個數字和一個特殊字符 (!@#$%^&*)',
  })
  password: string;
}
```

### 全局驗證配置
```typescript
// backend/src/main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,          // 自動移除未定義的屬性
    forbidNonWhitelisted: true, // 拒絕未定義的屬性
    transform: true,           // 自動轉換類型
  }),
);
```

## 🧪 測試

### 測試弱密碼
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"weak",
    "name":"Test User",
    "username":"testuser"
  }'
```

**預期響應**:
```json
{
  "message": [
    "密碼必須包含至少一個大寫字母、一個小寫字母、一個數字和一個特殊字符 (!@#$%^&*)",
    "密碼至少需要 8 個字符"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

### 測試強密碼
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test@1234",
    "name":"Test User",
    "username":"testuser"
  }'
```

**預期響應**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "username": "testuser",
      "email": "test@example.com",
      "name": "Test User",
      "avatar": null
    },
    "token": "..."
  }
}
```

## 📝 測試數據

所有測試帳號的密碼已更新為：`Test@1234`

測試帳號列表：
- alice@happyshare.com
- bob@happyshare.com
- carol@happyshare.com
- david@happyshare.com
- emma@happyshare.com

## 🔄 更新記錄

### 2025-10-29
- ✅ 安裝 class-validator 和 class-transformer
- ✅ 添加全局 ValidationPipe
- ✅ 實現密碼驗證規則（包含特殊字符）
- ✅ 更新 seed 文件中的測試密碼
- ✅ 更新所有文檔中的密碼引用
- ✅ 測試驗證功能（弱密碼被拒絕，強密碼通過）

## 💡 前端建議

在前端實現相同的密碼驗證以提供即時反饋：

```typescript
// 密碼驗證函數
export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('密碼至少需要 8 個字符');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('密碼必須包含至少一個小寫字母');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('密碼必須包含至少一個大寫字母');
  }
  if (!/\d/.test(password)) {
    errors.push('密碼必須包含至少一個數字');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('密碼必須包含至少一個特殊字符 (!@#$%^&*)');
  }
  
  return errors;
};
```

## 🔒 安全建議

1. **密碼加密**: 使用 bcrypt 進行密碼哈希（已實現）
2. **密碼強度**: 當前實現確保基本安全性
3. **進階建議**:
   - 考慮增加密碼長度要求（例如 12 個字符）
   - 實現密碼歷史記錄（防止重複使用舊密碼）
   - 添加密碼過期策略
   - 實現帳號鎖定機制（多次登入失敗後）
   - 添加雙因素認證（2FA）

## 📚 相關文檔

- [API 測試文檔](./API_TESTING.md)
- [測試數據說明](./TEST_DATA.md)
- [安全文檔](../SECURITY.md)
- [E2E 測試清單](../E2E_TEST_CHECKLIST.md)
