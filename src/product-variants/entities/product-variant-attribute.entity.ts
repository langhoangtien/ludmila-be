import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductVariantAttributeDocument =
  HydratedDocument<ProductVariantAttribute>;

@Schema()
export class ProductVariantAttribute {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  value: string;
}

export const AddressSchema = SchemaFactory.createForClass(
  ProductVariantAttribute,
);
