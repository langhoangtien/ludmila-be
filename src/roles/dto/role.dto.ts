import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsEnum, IsString } from 'class-validator';

export class RoleDto {
  @Allow()
  @ApiProperty()
  @IsString()
  @IsEnum({})
  id: string;

  @Allow()
  name?: string;
}
