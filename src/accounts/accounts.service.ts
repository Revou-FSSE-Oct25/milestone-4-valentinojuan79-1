import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateAccountDto) {
    const randomAccountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const newAccount = await this.prisma.account.create({
      data: {
        userId: userId,
        accountNumber: randomAccountNumber,
        type: dto.type,
        balance: 0,
      },
    });
    return {
      message: 'Rekening berhasil dibuat',
      data: newAccount,
    };
  }

  async findAll(userId: string) {
    const userAccounts = await this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return {
      message: 'Berhasil mengambil daftar rekening',
      data: userAccounts,
    };
  }

  async findOne(userId: string, accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!account) {
      throw new NotFoundException('Rekening tidak ditemukan.');
    }
    if (account.userId !== userId) {
      throw new ForbiddenException('Akses ditolak: Anda bukan pemilik rekening ini.');
    }
    return {
      message: 'Berhasil mengambil detail rekening',
      data: account, 
    };
  }

  async update(userId: string, accountId: string, dto: UpdateAccountDto) {
    await this.findOne(userId, accountId); 
    const updatedAccount = await this.prisma.account.update({
      where: { id: accountId },
      data: { ...dto },
    });
    return {
      message: 'Data rekening berhasil diperbarui',
      data: updatedAccount,
    };
  }

  async remove(userId: string, accountId: string) {
    const accountRecord = await this.findOne(userId, accountId);
    if (accountRecord.data.balance.greaterThan(0)) {
      throw new BadRequestException('Penghapusan gagal: Rekening masih memiliki saldo. Silakan tarik atau transfer dana terlebih dahulu.');
    }
    await this.prisma.account.delete({
      where: { id: accountId },
    });
    return {
      message: 'Rekening berhasil dihapus permanen',
    };
  }
}