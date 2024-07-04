import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../../base/entities/base.entity';
import { Product } from '../../products/entities/product.entity';
import { Type } from 'class-transformer';
import { ProductVariantAttribute } from './product-variant-attribute.entity';

export type ProductVariantDocument = HydratedDocument<ProductVariant>;

@Schema({
  toObject: {
    virtuals: true,
    getters: true,
  },
  timestamps: true,
})
export class ProductVariant extends BaseEntity {
  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, default: 0, min: 0, max: 100 })
  discount: number;

  @Prop({ min: 0 })
  salePrice: number;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  })
  @Type(() => Product)
  productId: Product;

  @Prop({ default: 0 })
  quantity: number;

  @Prop({ required: true })
  @Type(() => ProductVariantAttribute)
  attributes: ProductVariantAttribute[];

  @Prop()
  image?: string;
}

export const ProductVariantSchema =
  SchemaFactory.createForClass(ProductVariant);
export const ProductVariantSchemaFactory = () => {
  const productVariantSchema = ProductVariantSchema;
  // productVariantSchema.pre<ProductVariant>('save', function (next) {
  //   this.salePrice = Math.round((this.price * (100 - this.discount)) / 100);

  //   next();
  // });
  // productVariantSchema.pre('updateOne', function (next) {
  //   const update = this.getUpdate() as {
  //     price?: number;
  //     discount?: number;
  //     salePrice?: number;
  //   };
  //   if (update && update.price !== undefined && update.discount !== undefined) {
  //     update.salePrice = Math.round(
  //       (update.price * (100 - update.discount)) / 100,
  //     );
  //   }
  //   next();
  // });
  return productVariantSchema;
};
