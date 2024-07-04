import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { GENDER } from '../entities/customer.entity';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Thanh Phuong' })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '0984981825' })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(GENDER)
  gender?: GENDER;
}
