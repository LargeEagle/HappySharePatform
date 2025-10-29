import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: '用戶名不能為空' })
  @MinLength(3, { message: '用戶名至少需要 3 個字符' })
  username: string;

  @IsEmail({}, { message: '請輸入有效的郵箱地址' })
  @IsNotEmpty({ message: '郵箱不能為空' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '密碼不能為空' })
  @MinLength(8, { message: '密碼至少需要 8 個字符' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
    message: '密碼必須包含至少一個大寫字母、一個小寫字母、一個數字和一個特殊字符 (!@#$%^&*)',
  })
  password: string;

  @IsString()
  name?: string;
}

export class LoginDto {
  @IsEmail({}, { message: '請輸入有效的郵箱地址' })
  @IsNotEmpty({ message: '郵箱不能為空' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '密碼不能為空' })
  password: string;
}

export class AuthResponseDto {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      name?: string;
      avatar?: string;
    };
    token: string;
  };
}
