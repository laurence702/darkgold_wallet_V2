import {
  Body,
  Request,
  Controller,
  Post,
  Put,
  Get,
  UseGuards,
  Req,
  BadRequestException,
  Delete,
  Param,
} from '@nestjs/common';
import { UserAuthService } from './service';
import {
  RegisterDto,
  LoginDto,
  VerificationDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  changePasswordDto,
} from './dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { User } from './userDecorator';
import AuthGuard from '@guards/auth';

/**
 * @author Francis Laurece
 */
@Controller('user/auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @UseGuards(JwtAuthGuard, AuthGuard)
  @Get('allUsers')
  allUsers(): any {
    return this.userAuthService.getAllUsers();
  }

  @Post('register')
  register(@Body() body: RegisterDto): any {
    return this.userAuthService.register(body);
  }

  @UseGuards(JwtAuthGuard, AuthGuard)
  @Get('me')
  async getLoggedInUser(
    @Request() req: any,
    otherFunctionIdentifier: any,
  ): Promise<any> {
    try {
      if (otherFunctionIdentifier == 'userIdOnly') return await req.user.userID;
      return await req.user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, AuthGuard)
  @Put('change-pin')
  async changePin(@Body() body: any, @Request() req: any): Promise<any> {
    const userId = await this.getLoggedInUser(req, 'userIdOnly');
    console.log(req.user);
    return this.userAuthService.changePin(body, userId);
  }

  @UseGuards(JwtAuthGuard, AuthGuard)
  @Get('/:id')
  getUserById(@Param('id') uid: string): Promise<any> {
    try {
      return this.userAuthService.findByUid(uid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, AuthGuard)
  @Get('getbyspid/:spid')
  getUserBySpID(@Param('spid') spID: string): Promise<any> {
    try {
      return this.userAuthService.findBySpID(spID);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  login(@Body() body: any): Promise<any> {
    const first_time_login = false;
    const { email, password } = body;
    return this.userAuthService.login(email, password, first_time_login);
  }

  @Put('verify')
  verifyAccount(@Body() body: VerificationDto): Promise<any> {
    return this.userAuthService.verifyAccount(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put('make-admin')
  makeAdmin(@Body() payload: string, @Request() req: any): any {
    return this.userAuthService.makeAdmin(payload);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDto): Promise<any> {
    return this.userAuthService.forgotPassword(body);
  }

  @Put('reset-password')
  resetPassword(@Body() body: ResetPasswordDto): Promise<any> {
    return this.userAuthService.resetPassword(body);
  }

  @UseGuards(JwtAuthGuard, AuthGuard)
  @Put('change-password')
  changePassword(
    @Body() body: changePasswordDto,
    @User() user: any,
  ): Promise<any> {
    return this.userAuthService.changePassword(body, user);
  }

  @Post('resend-verification')
  async resendVericationCode(@Body('email') email: string): Promise<any> {
    return await this.userAuthService.resendVericationCode(email);
  }

  @Delete('delete-user')
  async deleteUser(@Body('user_id') user_id: string): Promise<any> {
    return await this.userAuthService.deleteUser(user_id);
  }
}
