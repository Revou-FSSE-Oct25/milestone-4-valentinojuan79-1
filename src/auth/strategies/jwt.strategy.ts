import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      // Ngambil token dari header: "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Tolak kalau token udah expired
      secretOrKey: process.env.JWT_SECRET!, // Rahasia dari .env
    });
  }

  // 1. Tambahkan role di deklarasi payload
  async validate(payload: { sub: string; email: string; role: string }) {
    
    // 2. Cek database untuk memastikan user masih hidup/belum diblokir
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    // Kalau user udah dihapus dari DB tapi tokennya masih ada, tolak!
    if (!user) throw new UnauthorizedException('Akses ditolak, user tidak ditemukan');

    // 3. Jangan return `user` mentah-mentah karena ada password-nya.
    // Return data yang penting aja. Ini akan otomatis nempel di `req.user`
    return { 
      userId: user.id, 
      email: user.email, 
      role: user.role // <-- Role dibawa biar gampang dicek sama Guard
    };
  }
}