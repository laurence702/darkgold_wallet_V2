import { Module } from '@nestjs/common';
import { MessagingController } from './controller';
import { MessagingService } from './service';

@Module({
  controllers: [MessagingController],
  providers: [MessagingService],
})
export class MessagingModule {}
