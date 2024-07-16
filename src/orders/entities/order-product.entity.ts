import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '../../base/entities/base.entity';
import { ProductVariant } from '../../product-variants/entities/product-variant.entity';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from '../../products/entities/product.entity';

export type OrderProductDocument = HydratedDocument<OrderProduct>;

@Schema()
export class OrderProduct extends BaseEntity {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant',
    required: true,
  })
  productVariantId: ProductVariant;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId: Product;
  @Prop({
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} must be an integer',
    },
  })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  image?: string;
}

export const OrderProductSchema = SchemaFactory.createForClass(OrderProduct);
