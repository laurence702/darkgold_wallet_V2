import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'First Name cannot be empty' })
  @IsString()
  firstName: string;

  @IsNotEmpty({ message: 'Last Name cannot be empty' })
  @IsString()
  lastName: string;

  @IsOptional()
  isActive: number;

  @IsNotEmpty({ message: 'Email Address cannot be empty' })
  @IsString()
  email: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsString()
  @MinLength(6, { message: 'password cannot be less than six character' })
  password: string;
}

export class makeAdminDto {
  @IsNotEmpty({ message: 'role cannot be empty' })
  user_id: string;
}

export class LoginDto {
  @IsNotEmpty({ message: 'Email Address cannot be empty' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password Field cannot be empty' })
  @IsString()
  password: string;
}

export class VerificationDto {
  @IsNotEmpty({ message: 'Verification code cannot be empty' })
  verificationCode: number;
}

export class ForgotPasswordDto {
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsString()
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Token cannot be empty' })
  @IsString()
  token: string;

  @IsNotEmpty({ message: 'Password canot be empty' })
  @IsString()
  password: string;

  @IsNotEmpty({ message: 'Confirm Password cannot be empty' })
  @IsString()
  confirmPassword: string;
}

export class changePasswordDto {
  @IsNotEmpty({ message: 'Old Password cannot be empty' })
  @IsString()
  oldPassword: string;

  @IsNotEmpty({ message: 'Password canot be empty' })
  @IsString()
  newPassword: string;

  @IsNotEmpty({ message: 'Confirm Password cannot be empty' })
  @IsString()
  confirmPassword: string;
}
