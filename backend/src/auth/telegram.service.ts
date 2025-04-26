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
      where: { telegramId }
    });
    
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          telegramId,
          username: telegramData.username || `user_${telegramId}`,
          firstName: telegramData.first_name || 'User',
          lastName: telegramData.last_name || '',
        }
      });
    }
    
    return user;
  }
} 