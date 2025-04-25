import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export class CreateTaskDto {
  @ApiProperty({ example: 'Buy groceries' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Get milk, bread, and eggs', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: Priority, example: Priority.MEDIUM })
  @IsEnum(Priority)
  priority: Priority;

  @ApiProperty({ example: '2024-03-20T12:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  categoryId: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
} 