import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOptionInfoDto } from './create-info.dto';
import { Type } from 'class-transformer';

export class CreateOptionDto {
  // Thay thế CreateCategoryDto thành CreateBrandDto ở đây
  @ApiProperty({ example: 'thuc pham cn' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  readonly address: string;

  @ApiProperty({ example: 'tpcn' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(11)
  readonly phoneNumber: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionInfoDto)
  infomations?: CreateOptionInfoDto[];
}
