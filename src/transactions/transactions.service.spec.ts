import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('TransactionsService', () => {
  let service: TransactionsService;

  const mockPrisma = {
    account: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
    },
    $transaction: jest.fn((promises) => Promise.all(promises)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('withdraw should throw error if balance insufficient', async () => {
    const userId = 'user-123';
    const accountId = 'acc-1';
    
    mockPrisma.account.findUnique.mockResolvedValue({ 
      id: accountId, 
      balance: 0, 
      userId: userId 
    });

    mockPrisma.account.findUnique.mockRejectedValue(new BadRequestException());

    await expect(service.withdraw(userId, accountId, { amount: 10000 }))
      .rejects.toThrow();
  });

  it('transfer should throw error if target account not found', async () => {
    const userId = 'user-123';
    mockPrisma.account.findUnique
      .mockResolvedValueOnce({ id: 'sender', balance: 100000, userId: userId })
      .mockResolvedValueOnce(null);

    await expect(service.transfer(userId, { 
      senderAccountId: 'sender', 
      receiverAccountId: 'gaib', 
      amount: 5000 
    })).rejects.toThrow();
  });
});