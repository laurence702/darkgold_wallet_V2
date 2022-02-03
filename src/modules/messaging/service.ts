import { Injectable } from '@nestjs/common';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';

@Injectable()
export class MessagingService {
  public constructor(@InjectTwilio() private readonly client: TwilioClient) {}

  async sendSMS() {
    try {
      return await this.client.messages.create({
        body: `Your verificationCode is 1234`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+2348084352639`,
      });
    } catch (e) {
      return e;
    }
  }
}
