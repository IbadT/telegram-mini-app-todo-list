import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class TelegramMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const initData = req.headers['tg-init-data'] as string;
    const botToken = process.env.BOT_TOKEN;

    // Пропускаем запрос, если нет данных инициализации
    if (!initData || !botToken) {
      console.warn('No Telegram init data or bot token found');
      return next();
    }

    try {
      // Разбираем строку initData
      const urlParams = new URLSearchParams(initData);
      const hash = urlParams.get('hash');
      urlParams.delete('hash');

      // Сортируем оставшиеся параметры
      const params = Array.from(urlParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

      // Создаем HMAC-SHA256
      const secret = crypto.createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest();

      const checkHash = crypto.createHmac('sha256', secret)
        .update(params)
        .digest('hex');

      // Проверяем хэш
      if (hash === checkHash) {
        // Данные валидны, добавляем информацию о пользователе
        const user = JSON.parse(urlParams.get('user') || '{}');
        req.headers['tg-user-id'] = user.id?.toString();
        next();
      } else {
        console.error('Invalid Telegram hash');
        res.status(403).json({ error: 'Invalid Telegram data' });
      }
    } catch (error) {
      console.error('Error validating Telegram data:', error);
      res.status(403).json({ error: 'Invalid Telegram data' });
    }
  }
} 