import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import PrismaService from '@services/prisma';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  create(createTransactionDto: CreateTransactionDto) {}

  async createTransferPin(payload: any) {
    try {
      const updateUserPin = await this.prisma.user.update({
        where: {
          userID: payload.userID,
        },
        data: {
          txPin: payload.txPin,
        },
      });
      if (updateUserPin) {
        return {
          status: true,
          message: `pin chnaged to ${payload.txPin}`,
          data: updateUserPin,
        };
      }
      throw new BadRequestException({
        status: 'failed',
        message: 'Failed to change pin',
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async transferFunds(payload: any) {
    try {
      //debitsender
      const sender = await this.prisma.user.findFirst({
        where: {
          userID: payload.senderSpid,
        },
      });
      if (sender) {
        const newBalance = sender.acct_balance - payload.transaction_amount;
        //update balance of sender
        const debitSender = await this.prisma.user.update({
          where: {
            userID: payload.senderSpid,
          },
          data: {
            acct_balance: newBalance,
          },
        });
      }
      //update receiver balance
      const recipientCredited = await this.creditReceiver(payload);
      if (recipientCredited) {
        return {
          status: true,
          message: `Transaction successful`,
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async creditReceiver(payload: any) {
    const receiver = await this.prisma.user.findFirst({
      where: {
        userID: payload.receiverSpid,
      },
    });
    if (receiver) {
      const newBalance = receiver.acct_balance + payload.transaction_amount;
      const creditAcct = await this.prisma.user.update({
        where: {
          userID: receiver.userID,
        },
        data: {
          acct_balance: newBalance,
        },
      });
      if (creditAcct) {
        return true;
      }
      return false;
    }
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
