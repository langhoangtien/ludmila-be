import { IsNotEmpty, MinLength, MaxLength, IsString } from 'class-validator';

export class CreateOptionInfoDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}
