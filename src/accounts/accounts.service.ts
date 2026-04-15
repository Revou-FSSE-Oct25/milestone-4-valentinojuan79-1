import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateAccountDto) {
    // Bikin nomor rekening acak (10 digit)
    const randomAccountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    // Simpan ke database
    const newAccount = await this.prisma.account.create({
      data: {
        userId: userId, // Diambil dari JWT
        accountNumber: randomAccountNumber,
        type: dto.type,
        balance: 0, // Saldo awal otomatis 0
      },
    });

    return {
      message: 'Rekening berhasil dibuat',
      data: newAccount,
    };
  }
  // 👇 TAMBAHKAN FUNGSI INI 👇
  async findAll(userId: string) {
    const userAccounts = await this.prisma.account.findMany({
      where: { 
        userId: userId // Kunci keamanan: Hanya cari rekening yang userId-nya cocok!
      },
      // Opsional: urutkan dari yang terbaru dibuat
      orderBy: { createdAt: 'desc' } 
    });

    return {
      message: 'Berhasil mengambil daftar rekening',
      data: userAccounts,
    };
  }
}