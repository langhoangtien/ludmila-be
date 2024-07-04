import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
  ValidateNested,
} from 'class-validator';
import { PAYMENT_METHOD } from '../entities/order.entity';
import { CreateOrderProductDto } from './create-product.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty({
    default: [
      {
        name: 'Tinh dau thong 60v',
        quantity: 4,
        productVariantId: '6642180bfad8c2090f272a92',
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => CreateOrderProductDto)
  @ValidateNested({ each: true })
  products: CreateOrderProductDto[];

  @ApiProperty({ default: '0378976756' })
  @IsNotEmpty()
  @Matches(/((\+84|84|0)(3|5|7|8|9|1[2689]))([0-9]{8})\b/, {
    message: 'Invalid phone number',
  })
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  receiverName: string;

  @ApiProperty()
  @IsNotEmpty()
  shippingAddress: string;

  @ApiProperty({ default: 'cod' })
  @IsOptional()
  @IsEnum(PAYMENT_METHOD)
  paymentMethod?: PAYMENT_METHOD.COD;
}
