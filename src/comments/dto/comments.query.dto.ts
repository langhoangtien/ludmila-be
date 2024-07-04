import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { BaseQueryDto } from '../../base/dto/base.dto';

export class CommentQueryDto extends BaseQueryDto<Comment> {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? String(value) : ''))
  @IsString()
  @IsOptional()
  productId?: string;
}
