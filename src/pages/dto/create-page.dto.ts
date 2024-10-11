import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsSlug } from '../../utils/validators/slug-validate';

export class CreatePageDto {
  // Thay thế CreateCategoryDto thành CreateBrandDto ở đây
  @ApiProperty({ example: 'thuc pham cn' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  readonly name: string;

  @ApiProperty({ example: 'tpcn' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Validate(IsSlug)
  readonly slug: string;

  @ApiProperty({ example: 'Tinh dau thong do cedar la phan pham' })
  @IsString()
  readonly content?: string;
}
