import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('telegram')
  @ApiOperation({ summary: 'Authenticate with Telegram' })
  @ApiResponse({ status: 200, description: 'Returns JWT token and user data.' })
  @ApiResponse({ status: 401, description: 'Invalid authentication data.' })
  async validateTelegramLogin(@Body() data: { initData: string }) {
    return this.authService.validateTelegramLogin(data);
  }
} 