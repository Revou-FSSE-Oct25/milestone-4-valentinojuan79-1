import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';

describe('AuthService (Unit Test)', () => {
  let service: AuthService;
  let prisma: any;

  const mockPrisma = {
    user: { findUnique: jest.fn(), create: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: { sign: () => 'token' } },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService);
  });

  it('REGISTER: Harus throw BadRequest (400) jika email sudah ada', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 1 });
    await expect(service.register({ email: 'ada@mail.com', password: '123', name: 'User' }))
      .rejects.toThrow(ConflictException);
  });

  it('LOGIN: Harus throw Unauthorized (401) jika email salah', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(service.login({ email: 'salah@mail.com', password: '123' }))
      .rejects.toThrow(UnauthorizedException);
  });
});