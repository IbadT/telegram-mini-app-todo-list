import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, Matches } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({ example: 'Updated Work', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '#00FF00', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Color must be a valid hex color code (e.g., #FF5733)',
  })
  color?: string;
}