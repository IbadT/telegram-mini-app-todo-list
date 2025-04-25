import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class TelegramMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const initData = req.headers['tg-init-data'];
    
    if (!initData) {
      console.warn('No Telegram init data found in request');
      return next();
    }

    try {
      // TODO: Add proper validation of Telegram WebApp data
      console.log('Telegram init data received:', initData);
      next();
    } catch (error) {
      console.error('Error validating Telegram data:', error);
      next();
    }
  }
} 