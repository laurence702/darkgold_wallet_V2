import { Module } from '@nestjs/common';
import { TransactionService } from './service';
import { TransactionController } from './controller';
import PrismaService from '@services/prisma';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService],
})
export class TransactionModule {}
