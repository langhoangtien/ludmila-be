import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateProductVariantDto } from './create-product-variant.dto';
import { IsOptional, IsNumber, ValidateIf, Min, Max } from 'class-validator';

export class UpdateProductVariantDto extends PartialType(
  OmitType(CreateProductVariantDto, ['productId']),
) {
  @IsOptional()
  @IsNumber()
  @ValidateIf((object) => object.discount !== undefined)
  @Min(0)
  @Max(100)
  readonly discount?: number;

  @IsOptional()
  @IsNumber()
  @ValidateIf((object) => object.price !== undefined)
  readonly price?: number;
}
