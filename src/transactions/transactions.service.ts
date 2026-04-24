import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType, Prisma } from '@prisma/client'; // Tambahkan Prisma di sini
import { WithdrawDto } from './dto/withdraw.dto';
import { DepositDto } from './dto/deposit.dto';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  private async getOwnedAccount(userId: string, accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!account) {
      throw new NotFoundException('Rekening tidak ditemukan.');
    }
    if (account.userId !== userId) {
      throw new ForbiddenException('Akses ditolak: Anda tidak memiliki otoritas atas rekening ini.');
    }
    return account;
  }

  async deposit(userId: string, dto: DepositDto) {
    const { accountId, amount } = dto;
    await this.getOwnedAccount(userId, accountId);

    const [transactionRecord, updatedAccount] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          type: TransactionType.DEPOSIT,
          amount,
          receiverAccountId: accountId,
          description: 'Setor Tunai',
        },
      }),
      this.prisma.account.update({
        where: { id: accountId },
        data: { balance: { increment: amount } },
      }),
    ]);

    return {
      message: 'Setor tunai berhasil!',
      newBalance: updatedAccount.balance,
      transaction: transactionRecord,
    };
  }

  async withdraw(userId: string, dto: WithdrawDto) {
    const { accountId, amount } = dto;
    const account = await this.getOwnedAccount(userId, accountId);
    const withdrawAmount = new Prisma.Decimal(amount);
    if (account.balance.lessThan(withdrawAmount)) {
      throw new BadRequestException('Transaksi gagal: Saldo tidak mencukupi.');
    }

    const [transactionRecord, updatedAccount] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          type: TransactionType.WITHDRAWAL,
          amount,
          senderAccountId: accountId,
          description: 'Tarik Tunai',
        },
      }),
      this.prisma.account.update({
        where: { id: accountId },
        data: { balance: { decrement: amount } },
      }),
    ]);

    return {
      message: 'Tarik tunai berhasil!',
      newBalance: updatedAccount.balance,
      transaction: transactionRecord,
    };
  }

  async transfer(userId: string, dto: TransferDto) {
    const { senderAccountId, receiverAccountId, amount } = dto;
    if (senderAccountId === receiverAccountId) {
      throw new BadRequestException('Transfer gagal: Tidak bisa transfer ke rekening yang sama.');
    }

    const senderAccount = await this.getOwnedAccount(userId, senderAccountId);
    
    const transferAmount = new Prisma.Decimal(amount);
    if (senderAccount.balance.lessThan(transferAmount)) {
      throw new BadRequestException('Transaksi gagal: Saldo pengirim tidak mencukupi.');
    }

    const receiverAccount = await this.prisma.account.findUnique({
      where: { id: receiverAccountId },
    });
    if (!receiverAccount) {
      throw new NotFoundException('Rekening tujuan tidak ditemukan.');
    }

    const [transactionRecord, updatedSender] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          type: TransactionType.TRANSFER,
          amount,
          senderAccountId,
          receiverAccountId,
          description: 'Transfer Dana',
        },
      }),
      this.prisma.account.update({
        where: { id: senderAccountId },
        data: { balance: { decrement: amount } },
      }),
      this.prisma.account.update({
        where: { id: receiverAccountId },
        data: { balance: { increment: amount } },
      }),
    ]);

    return {
      message: 'Transfer berhasil!',
      newBalance: updatedSender.balance,
      transaction: transactionRecord,
    };
  }

  async findAll(userId: string) {
    const userAccounts = await this.prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });
    
    const accountIds = userAccounts.map(acc => acc.id);

    return this.prisma.transaction.findMany({
      where: {
        OR: [
          { senderAccountId: { in: accountIds } },
          { receiverAccountId: { in: accountIds } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException('Riwayat transaksi tidak ditemukan.');
    }

    const userAccounts = await this.prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });
    const accountIds = userAccounts.map(acc => acc.id);

    const isSender = transaction.senderAccountId ? accountIds.includes(transaction.senderAccountId) : false;
    const isReceiver = transaction.receiverAccountId ? accountIds.includes(transaction.receiverAccountId) : false;

    if (!isSender && !isReceiver) {
      throw new ForbiddenException('Akses ditolak: Anda tidak berhak melihat transaksi ini.');
    }

    return transaction;
  }
}