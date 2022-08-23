import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './service';
import { fundAccountDto } from './transaction-dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/fund')
  fundUserAccount(@Body() fundDto: fundAccountDto) {
    return this.transactionService.fundUserAccount(fundDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  transferCoins(@Body() payload: any) {
    return this.transactionService.transferFunds(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Post('setpin')
  createPin(@Body() payload: any) {
    return this.transactionService.createTransferPin(payload);
  }

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  // @Body() updateTransactionDto: UpdateTransactionDto,
  @Patch(':id')
  update(@Param('id') id: string) {
    //return this.transactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    //return this.transactionService.remove(+id);
  }
}
