import {
  Body,
  Controller,
  Get,
  Post,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { AuthService } from '@modules/adminAuth/auth.service';
import {
  EmailDto,
  LoginDto,
  PasswordResetDto,
  CreateAdminDto,
} from '@modules/adminAuth/dto/auth.dto';
import { ServerResp } from '@interface/app';

@Controller('auth')
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto): Promise<ServerResp> {
    return await this.authService.login(body);
  }

  @Post('regiser')
  async regiser(@Body() userId: string): Promise<ServerResp> {
    return this.authService.createAdmin(userId);
  }

  // @Post('redeem_account')
  // async forgetPassword(@Body() body: EmailDto): Promise<ServerResp> {
  //   // Find user by email
  //   const user = await this.authService.getUserByEmail(body.email);
  //   if (!user) throw new BadRequestException('Invalid email address');

  //   // Create password reset token
  //   const token = await this.authService.generateResetToken(user.uid);

  //   // Send password reset email
  //   const passwordResetUrl = `${process.env.BASE_URL}auth/reset_password/${token}`;
  //   await this.authService.sendPasswordResetMail({
  //     name: user.firstName,
  //     email: user.email,
  //     passwordResetUrl,
  //   });
  //   return {
  //     statusCode: 200,
  //     message: 'Password reset link sent, Please check your mail',
  //   };
  // }

  // @Post('/reset_password/:token')
  // async resetPassword(
  //   @Param('token') token: string,
  //   @Body() body: PasswordResetDto,
  // ): Promise<ServerResp> {
  //   // Get user based on the token
  //   let user = await this.authService.getUserByResetToken(token);

  //   // If there is a user, set the new password
  //   user = await this.authService.resetUserPassword(user.uid, body);

  //   return {
  //     statusCode: 200,
  //     message: 'Password reset successfully, proceed to login',
  //   };
  // }
}
export default AuthController;
