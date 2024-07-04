import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import * as mongoose from 'mongoose';
import { BaseEntity } from '../../base/entities/base.entity';
import { Type } from 'class-transformer';
import { Category } from '../../categories/entities/category.entity';
import { Country } from '../../countries/entities/country.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { ProductAttribute } from './product-attribute';
import { Brand } from '../../brands/entities/brand.entity';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { ProductVariantDocument } from '../../product-variants/entities/product-variant.entity';
import { Model } from 'mongoose';
import { NextFunction } from 'express';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product extends BaseEntity {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  introduction?: string;

  @Prop({ default: false })
  isPublic: boolean;

  @Prop({ default: 0 })
  sold: number;

  @Prop()
  description?: string;

  @Prop()
  barCode?: string;

  @Prop()
  tags?: string[];

  @Prop({
    default: [0, 0, 0, 0, 0],
    validate: {
      validator: function (val: any[]) {
        return Array.isArray(val) && val.length === 5;
      },
      message: 'Ratings array must contain exactly 5 elements',
    },
  })
  @Type(() => Number)
  ratings?: number[];

  @Prop({ default: 0 })
  ratingAverage?: number;

  @Prop()
  @Type(() => ProductAttribute)
  attributes?: ProductAttribute[];

  @Prop()
  @IsArray()
  @IsOptional()
  images?: string[];

  @Prop()
  @IsString()
  @IsOptional()
  image?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' })
  @Type(() => Vendor)
  vendor?: Vendor;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  })
  @Type(() => Country)
  @Prop()
  country: Country;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  })
  @Type(() => Brand)
  @Prop()
  brand: Brand;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  @Type(() => Category)
  category: Category;

  // variants: ProductVariant[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export const ProductSchemaFactory = (
  productVariant: Model<ProductVariantDocument>,
) => {
  const productSchema = ProductSchema;
  productSchema.pre('findOneAndDelete', async function (next: NextFunction) {
    const productId = this.getFilter()['_id'];
    const filter = { productId: productId };
    await productVariant.deleteMany(filter);
    return next();
  });
  return productSchema;
};
