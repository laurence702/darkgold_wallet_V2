import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailModule } from '@modules/mail/mail.module';
import { UserAuthModule } from './user/module';
import { TwilioModule } from 'nestjs-twilio';
import { MessagingModule } from './messaging/module';
import { TransactionModule } from './transaction/module';

@Module({
  imports: [
    // ScheduleModule.forRoot(),
    // AuthModule,
    // TaskScheduleModule,
    // GalleryModule,
    UserAuthModule,
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
    MailerModule.forRoot({
      transport: `smtps://${process.env.EMAIL_FROM}:${process.env.EMAIL_PASS}@${process.env.EMAIL_HOST}`,
      defaults: {
        from: `"Dark Gold" <${process.env.EMAIL_FROM}>`,
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    MessagingModule,
    TransactionModule,
  ],
})
export default class Modules {}
