import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Returns JWT token and user data.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() data: { email: string; password: string }) {
    return this.authService.login(data.email, data.password);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async register(@Body() data: { email: string; password: string }) {
    return this.authService.register(data.email, data.password);
  };

  @Get('me')
  @ApiOperation({ summary: 'Get current user data' })
  @ApiResponse({ status: 200, description: 'Returns current user data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getMeByEmail(@Query('email') email: string) {
    return this.authService.getCurrentUser(email);
  }

  @Post('telegram')
  @ApiOperation({ summary: 'Authenticate with Telegram' })
  @ApiResponse({ status: 200, description: 'Returns JWT token and user data.' })
  @ApiResponse({ status: 401, description: 'Invalid authentication data.' })
  async validateTelegramLogin(@Body() data: { initData: string }) {
    return this.authService.validateTelegramLogin(data);
  }
} 