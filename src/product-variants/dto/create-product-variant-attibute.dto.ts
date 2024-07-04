import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductVariantAttributeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}
