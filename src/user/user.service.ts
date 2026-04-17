import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { id: userId } 
    });
    if (!user) {
      throw new NotFoundException('User tidak ditemukan.');
    }
    const { password, ...result } = user;
    return {
      message: 'Berhasil mengambil profil',
      data: result,
    };
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    await this.getProfile(userId);
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        phoneNumber: dto.phoneNumber,
        address: dto.address,
        idNumber: dto.idNumber,
        avatarUrl: dto.avatarUrl,
      },
    });
    const { password, ...result } = updatedUser;
    return {
      message: 'Profil berhasil diperbarui',
      data: result,
    };
  }
}