import {
  IsAlphanumeric,
  isEmail,
  Matches,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from '@utils/decorators/validators';

import { PickType } from '@nestjs/mapped-types';

class CreateAdminDto {
  @IsString({ message: 'Please provide a valid id' })
  @IsNotEmpty({ message: 'userId field cannot be empty' })
  userID: string;
}

class LoginDto {
  @IsString()
  @IsEmail({}, { message: 'Please provide a valid email' })
  @IsNotEmpty()
  email: string;

  @IsAlphanumeric()
  @MinLength(8)
  @MaxLength(15)
  password: string;
}

class EmailDto extends PickType(LoginDto, ['email'] as const) {}

class PasswordResetDto {
  // @ApiProperty({
  //   description: 'New user password',
  //   default: 'Akowanu@1234',
  // })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  // @ApiProperty({
  //   description: 'Confirm new password',
  //   default: 'Akowanu@1234',
  // })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Match('password', { message: 'Password not match' })
  passwordConfirm: string;
}

export { CreateAdminDto, LoginDto, EmailDto, PasswordResetDto };
