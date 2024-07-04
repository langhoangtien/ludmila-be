import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductAttributeDocument = HydratedDocument<ProductAttribute>;

export enum STYLE {
  COLOR = 'color',
  BUTTON = 'button',
  SELECT = 'select',
}

@Schema()
export class ProductAttribute {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  value: string[];

  @Prop({ default: STYLE.BUTTON, enum: STYLE })
  style: STYLE;

  @Prop()
  styleValue?: string[];
}

export const ProductAttributesSchema =
  SchemaFactory.createForClass(ProductAttribute);
