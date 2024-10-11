import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../../base/entities/base.entity';

export type PageDocument = HydratedDocument<Page>;
@Schema({
  timestamps: true,
})
export class Page extends BaseEntity {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true, unique: true })
  name: string;
}
export const PageSchema = SchemaFactory.createForClass(Page);
