// create-category.dto.ts (hoặc bất kỳ DTO nào khác trong bất kỳ module nào)

import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsSlug } from '../../utils/validators/slug-validate';

export class CreateCategoryDto {
  @ApiProperty({ example: 'thuc pham cn' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  //   @IsUnique({ message: 'Name must be unique' })
  readonly name: string;

  @ApiProperty({ example: 'tpcn' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Validate(IsSlug)
  //   @IsUnique({ message: 'Code must be unique' })
  readonly code: string;

  @ApiProperty({ example: 'tpcn' })
  @IsString()
  readonly parentId?: string;
}
