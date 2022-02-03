import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MessagingService } from './service';

@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get('send-verify-code')
  async send_verification_sms() {
    return await this.messagingService.sendSMS();
  }
}
