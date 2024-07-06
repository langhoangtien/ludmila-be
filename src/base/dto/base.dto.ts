import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

// import { RoleDto } from '../../roles/dto/role.dto';

export class BaseFilterDto {
  // @ApiPropertyOptional()
  // @IsOptional()
  // @ValidateNested({ each: true })
  // [P in keyof T]: string | null;
}

export class BaseSortDto<T> {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof T;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  order: string;
}

export class BaseQueryDto<T> {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 0))
  @IsNumber()
  @IsOptional()
  skip?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    type: String,
    example: { name: { $regex: 'thuc', $options: 'i' } },
  })
  @IsOptional()
  @Transform(({ value }) => (value ? JSON.parse(value) : {}))
  filter?: any;

  @ApiPropertyOptional({
    type: String,
    example: { name: { $regex: 'thuc', $options: 'i' } },
  })
  @IsOptional()
  @Transform(({ value }) => (value ? JSON.parse(value) : {}))
  filterRaw?: any;
  @ApiPropertyOptional({
    type: String,
    example: { orderBy: 'createdAt', order: '1' },
  })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(BaseSortDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => BaseSortDto)
  sort?: BaseSortDto<T> | null;
}

export class BaseQueryDtoAdmin {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  skip?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? String(value) : 'desc'))
  @IsString()
  @IsOptional()
  order?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? String(value) : 'createdAt'))
  @IsString()
  @IsOptional()
  orderBy?: string;
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? String(value) : ''))
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? String(value) : 'name'))
  @IsString()
  @IsOptional()
  searchField?: string;
}

export class RemoveManyQueryDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? JSON.parse(value) : []))
  @IsArray()
  ids: string[];
}
