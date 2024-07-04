import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Validate,
  IsOptional,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsSlug } from '../../utils/validators/slug-validate';
import { CreateProductAttribute } from './create-attribute.dto';
import { Type } from 'class-transformer';
import { CreateProductVariantDto } from '../../product-variants/dto/create-product-variant.dto';

export class CreateProductDto {
  @ApiProperty({ example: 'Glavproduct' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  readonly name: string;

  @IsBoolean()
  @IsOptional()
  readonly isPublic?: boolean;

  @ApiProperty({ example: 'glavproduct' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  //   @IsUnique({ message: 'Code must be unique' })
  readonly code: string;

  @ApiProperty({ example: 'tinh-dau-thong-do-nga' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  @Validate(IsSlug)
  readonly slug: string;

  @ApiProperty({ example: 'Tinh dau thong do cedar la phan pham' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  readonly introduction?: string;

  @ApiProperty({ example: 'Tinh dau thong do cedar la phan pham' })
  @IsString()
  readonly description?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly barCode?: string;

  @ApiProperty({ example: ['Tinh dau thong', 'Cedar'] })
  @IsOptional()
  @IsArray()
  readonly tags?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly image?: string;

  @ApiProperty()
  @IsOptional()
  readonly images?: string[];

  @ApiProperty({ example: '66335519990015b2f368c55e' })
  @IsOptional()
  @IsString()
  readonly vendor?: string;

  @ApiProperty({ example: '663350f2d8671c3ae20cdab1' })
  @IsString()
  readonly country: string;

  @ApiProperty({ example: '6645d74763919ad866fd9f9a' })
  @IsString()
  readonly brand: string;

  // @ApiProperty({ example: '66385ea80bd2a75ff748e9f1' })
  @IsString()
  readonly category: string;

  @ApiProperty({
    example: [
      { name: 'Size', values: ['S', 'M'], style: 'button' },
      {
        name: 'Màu',
        values: ['Xanh', 'Đỏ'],
        style: 'color',
        styleValues: ['#284080', 'red'],
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateProductAttribute)
  attributes?: CreateProductAttribute[];

  @ApiProperty({
    example: [
      {
        attributes: [
          { name: 'Size', value: 'S' },
          {
            name: 'Màu',
            value: 'Đỏ',
          },
        ],
        quantity: 0,
        price: 280,
        salePrice: 270,
        image: '663b8048353c6fa02aa76442',
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants: CreateProductVariantDto[];
}
