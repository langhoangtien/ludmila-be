import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { CreateProductVariantAttributeDto } from './create-product-variant-attibute.dto';
import mongoose from 'mongoose';
import { SalePrice } from '../../utils/validators/sale-price-validate';

export class CreateProductVariantDto {
  @ApiProperty({ example: 200, default: 0 })
  @IsNumber()
  readonly price: number;

  @ApiProperty({ example: 0, default: 0 })
  @IsNumber()
  @Validate(SalePrice)
  readonly salePrice: number;

  @ApiProperty({ example: 200, default: 0 })
  @IsNumber()
  readonly quantity: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly image?: string;

  readonly productId?: mongoose.Schema.Types.ObjectId;
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly _id: string;

  @ApiProperty({
    example: [
      { name: 'Size', value: 'S' },
      {
        name: 'Màu',
        value: 'Xanh',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantAttributeDto)
  attributes?: CreateProductVariantAttributeDto[];
}
