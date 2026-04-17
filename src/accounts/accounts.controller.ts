import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch, Delete } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Request() req, @Body() createAccountDto: CreateAccountDto) {
    const userId = req.user.userId; 
    return this.accountsService.create(userId, createAccountDto);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.userId;
    return this.accountsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param ('id') id: string) {
    const userId = req.user.userId;
    return this.accountsService.findOne(userId, id);
  }

  @Patch(':id')
  update(@Request() req, @Param ('id') id: string, @Body() dto: UpdateAccountDto) {
    const userId = req.user.userId;
    return this.accountsService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req, @Param ('id') id: string) {
    const userId = req.user.userId;
    return this.accountsService.remove(userId, id);
  }
}