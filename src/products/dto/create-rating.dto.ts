import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum STARS {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}
export class CreateProductRatingDto {
  @ApiProperty({ example: 5 })
  @IsNotEmpty()
  @IsEnum(STARS)
  star: STARS;
}
