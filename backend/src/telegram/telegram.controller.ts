import { Controller, Post, Body } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('send-button')
  async sendMiniAppButton(@Body() body: { chatId: number }) {
    await this.telegramService.sendMiniAppButton(body.chatId);
    return { success: true };
  }
} 