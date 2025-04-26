import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
  private bot: Telegraf;

  constructor(private configService: ConfigService) {
    this.bot = new Telegraf(this.configService.get('TELEGRAM_BOT_TOKEN') || '');
  }

  async sendMiniAppButton(chatId: number) {
    await this.bot.telegram.sendMessage(chatId, 'Open the task manager:', {
      reply_markup: {
        inline_keyboard: [[
          {
            text: 'Open Task Manager',
            web_app: { url: this.configService.get('MINI_APP_URL') || '' }
          }
        ]]
      }
    });
  }
} 