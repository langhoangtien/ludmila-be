import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateProductVariantDto } from './create-product-variant.dto';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateProductVariantDto extends PartialType(
  OmitType(CreateProductVariantDto, ['productId']),
) {
  @IsOptional()
  @IsNumber()
  readonly salePrice?: number;

  @IsOptional()
  @IsNumber()
  readonly price?: number;
}
