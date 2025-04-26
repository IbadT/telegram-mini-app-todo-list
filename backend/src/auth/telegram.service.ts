import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async validateTelegramUser(telegramData: {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
  }) {
    const { id: telegramId } = telegramData;
    
    let user = await this.prisma.user.findUnique({
      where: { telegramId: telegramId.toString() }
    });
    
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          telegramId: telegramId.toString(),
          username: telegramData.username || `user_${telegramId}`,
          firstName: telegramData.first_name || 'User',
          lastName: telegramData.last_name || '',
        }
      });
    }
    
    return user;
  }

  async findOrCreateUser(telegramData: any) {
    const user = await this.prisma.user.upsert({
      where: { telegramId: telegramData.id.toString() },
      update: {},
      create: {
        telegramId: telegramData.id.toString(),
        username: telegramData.username,
        firstName: telegramData.first_name,
        lastName: telegramData.last_name,
      },
    });
  }
} 