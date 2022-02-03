import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@services/jwt.strategy';
import PrismaService from '../../services/prisma';
import { UserAuthController } from './controller';
import { UserAuthService } from './service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserAuthController],
  providers: [UserAuthService, PrismaService, JwtStrategy],
  exports: [UserAuthService],
})
export class UserAuthModule {}
