import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderProductDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ default: '6642180bfad8c2090f272a92' })
  @IsNotEmpty()
  @IsString()
  productVariantId: string;
}
