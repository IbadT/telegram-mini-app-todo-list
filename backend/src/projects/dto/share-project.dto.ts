import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShareProjectDto {
  @ApiProperty({ example: 'abc123', description: 'Project share code' })
  @IsString()
  shareCode: string;
} 