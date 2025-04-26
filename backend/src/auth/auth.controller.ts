import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('telegram')
  @ApiOperation({ summary: 'Authenticate with Telegram' })
  @ApiResponse({ status: 200, description: 'Returns JWT token and user data.' })
  @ApiResponse({ status: 401, description: 'Invalid authentication data.' })
  async telegramLogin(@Body() data: any) {
    return this.authService.validateTelegramLogin(data);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.authService.register(body.email, body.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req) {
    return this.authService.me(req.user.sub);
  }
} 