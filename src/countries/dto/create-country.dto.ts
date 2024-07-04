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

export class CreateCountryDto {
  @ApiProperty({ example: 'Nga' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  //   @IsUnique({ message: 'Name must be unique' })
  readonly name: string;

  @ApiProperty({ example: 'nga' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Validate(IsSlug)
  readonly code: string;
}
