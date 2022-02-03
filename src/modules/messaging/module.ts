import { Module } from '@nestjs/common';
import { MessagingService } from './service';
import { MessagingController } from './controller';
import { TwilioModule } from 'nestjs-twilio';

@Module({
  controllers: [MessagingController],
  providers: [MessagingService],
  imports: [
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
  ],
})
export class MessagingModule {}
