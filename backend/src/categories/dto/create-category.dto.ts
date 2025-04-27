import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Work' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '#FF0000' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  projectId: number;
} 