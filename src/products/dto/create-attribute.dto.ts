import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEnum,
  IsArray,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { STYLE } from '../entities/product-attribute';

export class CreateProductAttribute {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  values: string[];

  @IsNotEmpty()
  @IsOptional()
  @IsEnum(STYLE)
  style?: STYLE;

  @IsOptional()
  styleValues?: string[];
}
