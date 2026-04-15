import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Pastikan path importnya bener ya

@Controller('accounts')
@UseGuards(JwtAuthGuard) // <-- Ini Satpamnya! Berlaku untuk semua endpoint di bawah ini
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Request() req, @Body() createAccountDto: CreateAccountDto) {
    // Ingat fungsi `validate` di jwt.strategy.ts?
    // Data { userId, email, role } yang kita return di sana otomatis masuk ke `req.user`
    const userId = req.user.userId; 
    
    // Oper userId dan tipe rekeningnya ke Service
    return this.accountsService.create(userId, createAccountDto);
  }

  @Get()
  findAll(@Request() req) {
    // 1. Ambil ID Asep dari tiket JWT yang dia bawa
    const userId = req.user.userId;
    
    // 2. Suruh Service nyari semua rekening milik Asep
    return this.accountsService.findAll(userId);
  }
}