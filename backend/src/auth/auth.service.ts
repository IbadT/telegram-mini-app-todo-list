import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...result } = user;
    const payload = { email: user.email, sub: user.id };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: result,
    };
  }

  async me(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }

  async validateTelegramLogin(data: any) {
    const user = await this.prisma.user.upsert({
      where: { telegramId: data.id.toString() },
      update: {
        username: data.username,
        firstName: data.first_name,
        lastName: data.last_name,
      },
      create: {
        telegramId: data.id.toString(),
        username: data.username,
        firstName: data.first_name,
        lastName: data.last_name,
      },
    });

    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
} 