import { Global, Module } from '@nestjs/common';
// import { BullModule } from 'nest-bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
// import { mailBullConfig } from '../../config/mail';
import { MailService } from './mail.service';

// import { MailController } from './mail.controller';
// import { MailQueue } from './mail.queue';

// @Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: `smtps://${process.env.EMAIL_FROM}:${process.env.EMAIL_PASS}@${process.env.EMAIL_HOST}`,
      defaults: {
        from: `"Digital Gold" <${process.env.EMAIL_FROM}>`,
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  // controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
