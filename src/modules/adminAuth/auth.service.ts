import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, PasswordResetDto, CreateAdminDto } from './dto/auth.dto';
import { ServerResp } from '@interface/app';
import PrismaService from '@services/prisma';
import { confirmPassword, hashPassword } from '@utils/password.helper';
import { User } from '@prisma/client';
import { createHash, createHmac, randomBytes } from 'crypto';
import { MailService } from '@modules/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async createAdmin(userId: string): Promise<any> {
    const query = await this.prisma.user.update({
      where: {
        userID: userId,
      },
      data: {
        role: 'ADMIN',
      },
    });
  }

  async generateJwt(id: number, userId: string): Promise<string> {
    return this.jwtService.signAsync({
      userId: { id: id, userId: userId },
      options: {
        expiresIn: '10000s',
      },
    });
  }

  async login(user: LoginDto): Promise<ServerResp> {
    try {
      const userExist = await this.prisma.user.findUnique({
        where: { email: user.email },
      });
      if (!userExist) return { statusCode: 404, message: 'Account not found' };
      if (userExist && !userExist.isActive)
        return { statusCode: 401, message: 'Account not activated' };
      const comfirmPass = await confirmPassword(
        user.password,
        userExist.password,
      );
      if (!comfirmPass)
        return { statusCode: 400, message: 'Incorrect password' };
      const token: string = await this.generateJwt(
        userExist.id,
        userExist.userID,
      );
      const returnData = {
        firstName: userExist.firstName,
        lastName: userExist.lastName,
        email: userExist.email,
        uid: userExist.userID,
      };
      return {
        statusCode: 200,
        message: 'Login successful',
        data: { token: token, user: returnData },
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: 'Oops, something went wrong. Please try again',
      };
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return this.prisma.user.findUnique({ where: { email: email } });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // async generateResetToken(userId: string): Promise<string> {
  //   try {
  //     const secreteToken = randomBytes(32).toString('hex');
  //     const passwordResetToken = createHash('sha256')
  //       .update(secreteToken)
  //       .digest('hex');

  //     await this.prisma.user.update({
  //       where: { uid: userId },
  //       data: {
  //         passwordResetToken,
  //         passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000),
  //       },
  //     });
  //     return passwordResetToken;
  //   } catch (error) {
  //     console.log(error);
  //     return '';
  //   }
  // }

  async sendPasswordResetMail(payload: any) {
    this.mailService.sendMail({
      templateName: 'password_reset',
      subject: 'DigitalGold User Password Reset',
      recipients: ['ganiu.akowanu@gmail.com'],
      payload: payload,
    });
  }

  // async getUserByResetToken(token: string): Promise<User> {
  //   const passwordResetToken = createHash('sha256').update(token).digest('hex');

  //   const user = await this.prisma.user.findFirst({
  //     where: {
  //       passwordResetToken,
  //       passwordResetExpires: { gt: new Date() },
  //     },
  //   });

  //   if (!user) throw new UnauthorizedException('Invalid reset token');
  //   return user;
  // }

  // async resetUserPassword(uid: string, body: PasswordResetDto): Promise<User> {
  //   const password = await hashPassword(body.password);

  //   return this.prisma.user.update({
  //     where: { uid },
  //     data: {
  //       password,
  //       passwordResetToken: null,
  //       passwordResetExpires: null,
  //       passwordChangedAt: new Date(),
  //     },
  //   });
  // }
}
