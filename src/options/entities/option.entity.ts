import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../../base/entities/base.entity';
import { Type } from 'class-transformer';
import { Info } from './option.info';

export type OptionDocument = HydratedDocument<Option>;
@Schema({
  timestamps: true,
})
export class Option extends BaseEntity {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  @Type(() => Info)
  infomations?: Info[];
}
export const OptionSchema = SchemaFactory.createForClass(Option);
