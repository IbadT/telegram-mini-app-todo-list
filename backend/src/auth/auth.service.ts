import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateTelegramLogin(data: any) {
    const user = await this.prisma.user.upsert({
      where: { telegramId: data.id.toString() },
      update: {
        username: data.username,
        firstName: data.first_name,
        lastName: data.last_name,
      },
      create: {
        telegramId: data.id.toString(),
        username: data.username,
        firstName: data.first_name,
        lastName: data.last_name,
      },
    });

    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async me(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
} 