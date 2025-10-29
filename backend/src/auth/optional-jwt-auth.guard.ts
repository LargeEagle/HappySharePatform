// HAPPY SHARE - 可選 JWT 認證守衛
// 允許未登入用戶訪問，但如果提供了 token 則驗證並附加用戶信息

import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // 重寫 canActivate 方法，使其總是返回 true
  // 即使沒有 token 或 token 無效也允許訪問
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // 嘗試調用父類的 canActivate
      await super.canActivate(context);
    } catch (error) {
      // 如果認證失敗，忽略錯誤，繼續執行
      // 這樣未登入用戶也可以訪問
    }
    
    // 總是返回 true，允許請求繼續
    return true;
  }

  // 重寫 handleRequest 方法
  handleRequest(err: any, user: any) {
    // 如果有錯誤或沒有用戶，返回 null（而不是拋出錯誤）
    // 這樣 req.user 會是 null，但請求不會被拒絕
    if (err || !user) {
      return null;
    }
    
    return user;
  }
}
