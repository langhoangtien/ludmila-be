// create-category.dto.ts (hoặc bất kỳ DTO nào khác trong bất kỳ module nào)

import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RATING } from '../entities/comment.entity';

export class CreateCommentDto {
  @ApiProperty({ example: 'thuc pham cn' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  readonly fullName?: string;

  @ApiProperty({ enum: RATING, example: RATING.FOUR })
  @IsEnum(RATING, { message: 'Rating must be one of [1, 2, 3, 4, 5]' })
  @IsOptional()
  readonly rating?: RATING;

  @ApiProperty({ example: '+84901234567' })
  @IsString()
  @MaxLength(12)
  @Matches(/((\+84|84|0)(3|5|7|8|9|1[2689]))([0-9]{8})\b/, {
    message: 'Invalid Vietnamese phone number',
  })
  @IsOptional()
  readonly phoneNumber?: string;

  @ApiProperty({ example: 'thuc pham cn' })
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly productId: string;
}
