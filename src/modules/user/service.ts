import { randomInt } from 'crypto';
import { sendSms } from '../../utils/helper';
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import PrismaService from '../../services/prisma';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {
  RegisterDto,
  LoginDto,
  VerificationDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  changePasswordDto,
} from './dto';

import {
  generateCode,
  getRealUserLocation,
  getUserDevice,
} from '../../utils/helper';
//import { EmailTemplates } from '../../utils/email.template'
import {
  sendUserWelcomeMail,
  sendForgotPasswordToken,
} from '@utils/email.service';
import { USER_ROLES, User } from '@prisma/client';
import { Number } from 'aws-sdk/clients/iot';
import { Request } from 'express';

/***
 *
 * @author Daniel Ozeh hello@danielozeh.com.ng
 */
@Injectable()
export class UserAuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async makeAdmin(payload: any) {
    console.log(payload);
    try {
      const { email } = payload;
      const userExists = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!userExists) {
        return new NotFoundException('User not found');
      }
      const isNowAdmin = await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          role: 'ADMIN',
        },
      });
      if (isNowAdmin) {
        return { status: true, message: 'User now an admin', data: userExists };
      }
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  generatePocketID(): number {
    const pocketID = Math.floor(new Date().valueOf() * Math.random());
    return pocketID;
  }

  async register(data: RegisterDto) {
    const spID = +Math.abs(this.generatePocketID());
    const { firstName, lastName, email, password, phoneNumber } = data;
    try {
      const isEmailExist = await this.prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      //ensures two people dont have same spId
      const spIDExists = await this.prisma.user.findFirst({
        where: {
          spID: spID,
        },
      });
      if (spIDExists) {
        //generate new ID
        const spID = +Math.abs(this.generatePocketID());
      }
      if (isEmailExist) {
        throw new BadRequestException({
          status: 'failed',
          message: 'Email Address already exist',
        });
      }
      const verificationCode = randomInt(1001, 9999);
      const userLocation = await getRealUserLocation();
      const userDevice = await getUserDevice();

      const addUser = await this.prisma.user.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          password: await bcrypt.hash(password, 10),
          isActive: 1,
          isVerified: 0,
          spID: +spID,
          verificationCode: verificationCode,
          registeredIp: userLocation.data.query,
          registeredCountry: userLocation.data.country,
          registeredState: userLocation.data.city,
          registeredRegion: userLocation.data.regionName,
          registeredTimezone: userLocation.data.timezone,
          registeredBrowser: userDevice.client.name,
          registeredDeviceType: userDevice.device.type,
          registeredOperatingSytsem: userDevice.os.name,
        },
      });

      if (addUser) {
        await this.prisma.userProfile.create({
          data: {
            userID: addUser.userID,
          },
        });
        const body = `Dear ${firstName} Your Digital gold verification code is ${verificationCode}`;
        await sendSms(body, phoneNumber);

        return await this.login(email, password, true);

        // return {
        //   status: 'success',
        //   message:
        //     'Registration Successful, please verify your account with the code',
        //   data: {
        //     verificationCode: verificationCode,
        //   },
        // };
      }
      throw new BadRequestException({
        status: 'failed',
        message: 'Registration failed. Try again!',
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async login(email: string, password: string, first_time_login: boolean) {
    try {
      const isEmailExist = await this.prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      if (isEmailExist) {
        if (isEmailExist.isActive == 0) {
          throw new BadRequestException({
            status: 'failed',
            message: 'Your Account has been blocked',
          });
        }
        const passwordValid = await bcrypt.compare(
          password,
          isEmailExist.password,
        );

        if (!passwordValid) {
          throw new BadRequestException({
            status: 'failed',
            message: 'Invalid login credentials',
          });
        }
        if (
          isEmailExist.role == USER_ROLES.MEMBER &&
          isEmailExist.isVerified == 0 &&
          first_time_login !== true
        ) {
          throw new BadRequestException({
            status: 'failed',
            message: 'Please verify your account to continue',
          });
        }
        //set him online before generating token
        await this.setOnlineStatus(1, isEmailExist.userID);
        return this.generateToken({
          uid: isEmailExist.userID,
          firstName: isEmailExist.firstName,
          lastName: isEmailExist.lastName,
          email: isEmailExist.email,
          role: isEmailExist.role,
          spID: isEmailExist.spID,
        });
      }

      throw new BadRequestException({
        status: 'failed',
        message: 'Account does not exist',
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async sendVerifyCodeViaSms() {
    return;
  }

  async setOnlineStatus(status: number, userID: string): Promise<any> {
    try {
      const setOnline = await this.prisma.user.update({
        where: {
          userID: userID,
        },
        data: {
          onlineStatus: status,
        },
      });
      if (setOnline) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  generateToken(payload: {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    spID: number;
  }) {
    return {
      user: {
        userId: payload.uid,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        role: payload.role,
        spID: payload.spID,
      },
      accessToken: this.generateAccessToken(payload),
    };
  }

  private generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload);
  }

  async verifyAccount(data: VerificationDto) {
    const { verificationCode } = data;

    try {
      const details = await this.prisma.user.findFirst({
        where: { verificationCode },
      });

      if (!details) {
        throw new BadRequestException({
          status: 'failed',
          message: 'Invalid Verification code!',
        });
      }
      if (details.isVerified == 1) {
        throw new BadRequestException('This account is already verified');
      }

      //update user
      const updateUser = await this.prisma.user.update({
        data: {
          isVerified: 1,
        },
        where: {
          userID: details.userID,
        },
      });

      if (updateUser) {
        return {
          status: 'success',
          message: 'Account Verified. Proceed to Login',
        };
      }

      throw new BadRequestException({
        status: 'failed',
        message: 'Failed to Verify Account',
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async forgotPassword(data: ForgotPasswordDto) {
    try {
      const { email } = data;
      //check if emailexist
      const isEmailExist = await this.prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      if (isEmailExist) {
        //generate token
        const token = await generateCode(8);
        //save token to password reset table
        const save = await this.prisma.userPasswordReset.create({
          data: {
            email: email,
            token: token,
          },
        });
        if (save) {
          //send email to user with token
          const firstName = isEmailExist.firstName;
          const lastName = isEmailExist.lastName;
          //send email to user with verification code
          await sendForgotPasswordToken(
            'Forgot Password',
            email,
            firstName,
            lastName,
            token,
          );
          return {
            status: 'success',
            message: 'A password code has been e-mailed to you',
          };
        }
        return { status: 'failed', message: 'Failed to send password token' };
      }
      throw new BadRequestException({
        status: 'failed',
        message: 'Email does not exist',
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async resetPassword(data: ResetPasswordDto) {
    try {
      const { token, password, confirmPassword } = data;

      if (password != confirmPassword) {
        throw new BadRequestException({
          status: 'failed',
          messafe: 'Passwords do not match',
        });
      }
      //verify if token is valid and active
      const isValid = await this.prisma.userPasswordReset.findFirst({
        where: {
          token: token,
        },
      });
      if (isValid) {
        if (isValid.status == 1) {
          throw new BadRequestException({
            status: 'failed',
            message: 'Token has been used',
          });
        }

        //update user password
        const updatePassword = await this.prisma.user.update({
          where: {
            email: isValid.email,
          },
          data: {
            password: await bcrypt.hash(password, 10),
          },
        });
        if (updatePassword) {
          //update token set status to 1
          await this.prisma.userPasswordReset.update({
            where: {
              id: isValid.id,
            },
            data: {
              status: 1,
            },
          });
          return { status: 'success', message: 'Password changed!' };
        }
        throw new BadRequestException({
          status: 'failed',
          message: 'Failed to change password',
        });
      }
      throw new BadRequestException({
        status: 'failed',
        message: 'Invalid token!',
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async changePassword(data: changePasswordDto, header: Request) {
    try {
      const id = Number(header);
      const { oldPassword, newPassword, confirmPassword } = data;
      if (newPassword != confirmPassword) {
        throw new BadRequestException({
          status: 'failed',
          message: 'Passwords do not match',
        });
      }

      //get user by id
      const user = await this.prisma.user.findFirst({ where: { id } });

      const passwordValid = await bcrypt.compare(oldPassword, user.password);
      if (!passwordValid) {
        throw new BadRequestException({
          status: 'failed',
          message: 'Old password is incorrect!',
        });
      }

      //update the user
      const updateUser = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          password: await bcrypt.hash(newPassword, 10),
        },
      });

      if (updateUser) {
        return { status: 'success', message: 'Password Updated!' };
      }
      throw new BadRequestException({
        status: 'failed',
        message: 'Failed to change password',
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findByUid(userId: string): Promise<any> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          userID: userId,
        },
        select: {
          userID: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          isVerified: true,
          isActive: true,
          role: true,
          spID: true,
          acct_balance: true,
          money_sent: true,
          money_received: true,
          onlineStatus: true,
          registeredCountry: true,
          registeredState: true,
          registeredRegion: true,
          registeredTimezone: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (user) {
        return user;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findBySpID(spID: number): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          spID: spID,
        },
      });
      if (user) {
        return user;
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async userChangedPassword(user: User, timestamp: number): Promise<boolean> {
    if (user.passwordChangedAt) {
      const changedTimestamp = user.passwordChangedAt.getTime() / 1000;
      return timestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
  }

  async getAllUsers(): Promise<any> {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          userID: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          isVerified: true,
          isActive: true,
          acct_balance: true,
          verificationCode: true,
          role: true,
          onlineStatus: true,
          registeredIp: true,
          money_received: true,
          money_sent: true,
          spID: true,
          registeredCountry: true,
          registeredState: true,
          registeredRegion: true,
          registeredTimezone: true,
          registeredBrowser: true,
          registeredOperatingSytsem: true,
          registeredDeviceType: true,
          txPin: true,
        },
      });
      if (users) {
        return {
          status: HttpStatus.OK,
          message: 'List of all users',
          data: users,
        };
      }
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'No user found',
        data: [],
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async resendVericationCode(email: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email },
      });
      if (user) {
        const verificationCode = `${user.verificationCode}`;
        const body = `Your verification code is ${verificationCode}`;
        await sendSms(body, user.phoneNumber);
        return {
          status: true,
          statusCode: HttpStatus.ACCEPTED,
          verify_code: +verificationCode,
        };
      }
      return {
        status: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteUser(user_id: string): Promise<any> {
    // try {
    //   const [deleteProfile, deleteUser] = await this.prisma.$transaction([
    //     this.prisma.$executeRaw`DELETE FROM users WHERE uid = ${user_id};`,
    //     this.prisma.$executeRaw`DELETE FROM userProfiles WHERE userId = ${user_id};`,
    //   ]);
    //   if (deleteProfile && deleteUser) {
    //     return {
    //       statusCode: HttpStatus.ACCEPTED,
    //       message: `user has been deleted`,
    //       data: deleteUser,
    //     };
    //   }
    //   return {
    //     statusCode: HttpStatus.FORBIDDEN,
    //     message: `Failed to delete`,
    //   };
    // } catch (error) {
    //   throw new InternalServerErrorException(error.message);
    // }
    const deleteProfile = await this.prisma.userProfile.delete({
      where: {
        userID: user_id,
      },
    });
    if (deleteProfile) {
      const deleteUser = await this.prisma.user.delete({
        where: {
          userID: user_id,
        },
      });
      if (deleteUser) {
        return {
          statusCode: HttpStatus.ACCEPTED,
          message: `user has been deleted`,
          data: deleteUser,
        };
      }
    }
  }
}
