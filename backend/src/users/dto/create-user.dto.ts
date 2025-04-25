import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 123456789, description: 'Telegram user ID' })
  @IsNumber()
  telegramId: number;

  @ApiProperty({ example: 'john_doe', description: 'Telegram username' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsString()
  @IsOptional()
  lastName?: string;
} 