import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import PrismaService from '@services/prisma';
import { fundAccountDto } from './transaction-dto';
const referralCodeGenerator = require('referral-code-generator');

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  fundUserAccount(fundUserDto: fundAccountDto): Promise<User> {
    return this.prisma.user.update({
      data: {
        acct_balance: {
          increment: fundUserDto.amount,
        },
      },
      where: {
        spID: fundUserDto.spID,
      },
    });
  }

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

  async BalanceSufficientToSend(data: any) {
    const userBalance = data.sender.acct_balance;
    const amountToSend = data.payload.transaction_amount;
    if (userBalance >= amountToSend) {
      return true;
    }
    return false;
  }

  async transferFunds(payload: any) {
    try {
      const sender = await this.prisma.user.findFirst({
        where: {
          spID: payload.senderSpid,
        },
      });
      if (!sender) throw new BadRequestException('User spID not found');
      if (sender) {
        const data = { sender, payload };
        if (+payload.pin !== +sender.txPin) {
          console.log(data.payload.pin, data.sender.txPin);
          throw new BadRequestException('Wrong Pin');
        }
        if ((await this.BalanceSufficientToSend(data)) === false) {
          throw new BadRequestException(
            'Insufficient balance, fund wallet to proceed',
          );
        }
        const newBalance = sender.acct_balance - payload.transaction_amount;
        //update balance of sender
        const debitSender = await this.prisma.user.update({
          where: {
            spID: payload.senderSpid,
          },
          data: {
            acct_balance: newBalance,
          },
        });
      }
      //update receiver balance
      const recipientCredited = await this.creditReceiver(payload);
      if (recipientCredited) {
        await this.updateTransactionHistory(payload);
        return {
          status: true,
          message: `Transaction successful`,
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateTransactionHistory(payload: any) {
    const query = await this.prisma.transactionHistory.create({
      data: {
        t_ref: referralCodeGenerator.alphaNumeric('uppercase', 4, 2),
        recipientId: payload.receiverSpid,
        senderId: payload.senderSpid,
        transaction_amount: payload.transaction_amount,
      },
    });
  }

  async creditReceiver(payload: any) {
    const receiver = await this.prisma.user.findFirst({
      where: {
        spID: payload.receiverSpid,
      },
    });
    if (receiver) {
      const newBalance = receiver.acct_balance + payload.transaction_amount;
      const creditAcct = await this.prisma.user.update({
        where: {
          spID: receiver.spID,
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

  async findAll() {
    try {
      const Transactions = await this.prisma.transactionHistory.findMany({
        include: {
          sender: {},
          recipient: {},
        },
      });
      if (Transactions) {
        return Transactions;
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
