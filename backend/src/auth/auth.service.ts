import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { createHash, createHmac } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateTelegramLogin(data: any) {
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      throw new UnauthorizedException('Bot token not configured');
    }

    // Check if the data is fresh (not older than 1 hour)
    const currentTime = Math.floor(Date.now() / 1000);
    if (!data.auth_date || currentTime - data.auth_date > 3600) {
      throw new UnauthorizedException('Authentication data expired');
    }

    // Create a data check string
    const dataCheckArr = Object.keys(data)
      .filter((key) => key !== 'hash')
      .map((key) => `${key}=${data[key]}`)
      .sort()
      .join('\n');

    // Create a secret key from the bot token
    const secretKey = createHash('sha256').update(botToken).digest();

    // Calculate the hash
    const calculatedHash = createHmac('sha256', secretKey)
      .update(dataCheckArr)
      .digest('hex');

    // Verify the hash
    if (calculatedHash !== data.hash) {
      throw new UnauthorizedException('Invalid authentication data');
    }

    // Create or update user
    const user = await this.prisma.user.upsert({
      where: { telegramId: data.id },
      update: {
        username: data.username,
        firstName: data.first_name,
        lastName: data.last_name,
      },
      create: {
        telegramId: data.id,
        username: data.username,
        firstName: data.first_name,
        lastName: data.last_name,
      },
    });

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      telegramId: user.telegramId,
    });

    return {
      user,
      token,
    };
  }
} 