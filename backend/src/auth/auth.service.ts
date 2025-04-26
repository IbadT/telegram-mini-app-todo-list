import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateTelegramLogin(data: any) {
    try {
      // Verify Telegram data
      const initData = new URLSearchParams(data.initData);
      const hash = initData.get('hash');
      initData.delete('hash');
      
      const dataCheckString = Array.from(initData.entries())
        .map(([key, value]) => `${key}=${value}`)
        .sort()
        .join('\n');

      const secret = await this.configService.get('TELEGRAM_BOT_TOKEN');
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', Buffer.from('WebAppData', 'utf8'))
        .update(secret)
        .digest();
      
      const calculatedHash = crypto.createHmac('sha256', hmac)
        .update(dataCheckString)
        .digest('hex');

      if (calculatedHash !== hash) {
        throw new Error('Invalid Telegram data');
      }

      // Parse user data
      const userDataStr = initData.get('user');
      if (!userDataStr) {
        throw new Error('No user data provided');
      }
      const userData = JSON.parse(userDataStr);
      
      // Create or update user
      const user = await this.prisma.user.upsert({
        where: { telegramId: userData.id.toString() },
        update: {
          username: userData.username,
          firstName: userData.first_name,
          lastName: userData.last_name,
        },
        create: {
          telegramId: userData.id.toString(),
          username: userData.username,
          firstName: userData.first_name,
          lastName: userData.last_name,
        },
      });

      // Generate JWT token
      const payload = { sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
        user,
      };
    } catch (error) {
      console.error('Telegram auth error:', error);
      throw new Error('Authentication failed');
    }
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