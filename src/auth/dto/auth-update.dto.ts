import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { PROVINCES } from '../../users/entities/user.entity';
import { GENDER } from '../../customers/entities/customer.entity';

export class AuthUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(100, { message: 'fileURLIsTooLong' })
  photo?: string | null;

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  @MaxLength(50, { message: 'firstNameIsTooLong' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @MaxLength(50, { message: 'lastNameIsTooLong' })
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  birthday?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  @IsEnum(GENDER)
  gender?: GENDER;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  @Matches(/((\+84|84|0)(3|5|7|8|9|1[2689]))([0-9]{8})\b/, {
    message: 'Invalid Vietnamese phone number',
  })
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  @IsEnum(PROVINCES)
  province?: PROVINCES;

  @ApiPropertyOptional()
  @MaxLength(255, { message: 'addressIsTooLong' })
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'new.email@example.com' })
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @Transform(lowerCaseTransformer)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  oldPassword?: string;
}
