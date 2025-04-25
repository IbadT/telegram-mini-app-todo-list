import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'My Awesome Project' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'This is a description of my project', required: false })
  @IsString()
  @IsOptional()
  description?: string;
} 