import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth/telegram')
export class TelegramController {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() telegramData: {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
  }) {
    try {
      const user = await this.telegramService.validateTelegramUser(telegramData);
      const token = this.jwtService.sign({ 
        sub: user.id,
        telegramId: user.telegramId 
      });
      
      return { token, user };
    } catch (error) {
      throw new UnauthorizedException('Invalid Telegram data');
    }
  }
} 