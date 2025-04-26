import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiProperty({ example: 'My Updated Project', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
} 