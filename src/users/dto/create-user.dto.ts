import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
  MinLength,
} from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { ROLE, STATUS } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @IsOptional()
  @Matches(/((\+84|84|0)(3|5|7|8|9|1[2689]))([0-9]{8})\b/, {
    message: 'Invalid phone number',
  })
  phoneNumber?: string;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName: string | null;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  photo?: string | null;

  @ApiPropertyOptional({ example: 'user' })
  @IsEnum(ROLE)
  role: ROLE;

  @ApiPropertyOptional({ example: 'inactive' })
  @IsOptional()
  @IsEnum(STATUS)
  status: STATUS;

  hash?: string | null;
}
