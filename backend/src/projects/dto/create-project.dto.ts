import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'My Awesome Project' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'This is a description of my project', required: false })
  @IsString()
  description?: string;
} 