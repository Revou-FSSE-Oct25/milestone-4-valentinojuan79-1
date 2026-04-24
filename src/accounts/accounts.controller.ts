import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch, Delete } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Accounts')
@ApiBearerAuth()
@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiOperation({ summary: 'Create a new bank account' })
  @Post()
  create(@Request() req, @Body() createAccountDto: CreateAccountDto) {
    const userId = req.user.userId; 
    return this.accountsService.create(userId, createAccountDto);
  }

  @ApiOperation({ summary: 'Get all bank accounts for the authenticated user' })
  @Get()
  findAll(@Request() req) {
    const userId = req.user.userId;
    return this.accountsService.findAll(userId);
  }

  @ApiOperation({ summary: 'Get details of a specific bank account' })
  @Get(':id')
  findOne(@Request() req, @Param ('id') id: string) {
    const userId = req.user.userId;
    return this.accountsService.findOne(userId, id);
  }

  @ApiOperation({ summary: 'Update a bank account' })
  @Patch(':id')
  update(@Request() req, @Param ('id') id: string, @Body() dto: UpdateAccountDto) {
    const userId = req.user.userId;
    return this.accountsService.update(userId, id, dto);
  }

  @ApiOperation({ summary: 'Delete a bank account' })
  @Delete(':id')
  remove(@Request() req, @Param ('id') id: string) {
    const userId = req.user.userId;
    return this.accountsService.remove(userId, id);
  }
}