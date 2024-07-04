import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsString } from 'class-validator';

export class StatusDto {
  @ApiProperty()
  @IsString()
  @Allow()
  id: string;

  @Allow()
  name?: string;
}
