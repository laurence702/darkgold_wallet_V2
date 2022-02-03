import { Module } from '@nestjs/common';
import AuthController from '@modules/adminAuth/auth.controller';
import { AuthService } from '@modules/adminAuth/auth.service';
import PrismaService from '@services/prisma';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { JwtStrategy } from '@services/jwt.strategy';
import { MailModule } from '@modules/mail/mail.module';
import { MailService } from '@modules/mail/mail.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '172800s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PassportModule,
    AuthService,
    PrismaService,
    JwtStrategy,
    JwtAuthGuard,
    MailService,
  ],
})
export default class AppModule {}
