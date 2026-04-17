import { Controller, Post, Body, UseGuards, Param, Request, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  deposit(@Request() req, @Body() dto: DepositDto) {
    const userId = req.user.userId;
    return this.transactionsService.deposit(userId, dto);
  }

  @Post('withdraw')
  withdraw(@Request() req, @Body() dto: WithdrawDto) {
    const userId = req.user.userId;
    return this.transactionsService.withdraw(userId, dto);
  }

  @Post('transfer')
  transfer(@Request() req, @Body() dto: TransferDto) {
    const userId = req.user.userId;
    return this.transactionsService.transfer(userId, dto);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.userId;
    return this.transactionsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.transactionsService.findOne(userId, id);
  }
}