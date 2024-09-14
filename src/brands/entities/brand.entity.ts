import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../../base/entities/base.entity';
import { IsOptional, IsString } from 'class-validator';

export type BrandDocument = HydratedDocument<Brand>; // Thay thế CategoryDocument thành BrandDocument ở đây

@Schema({
  toObject: {
    virtuals: true,
    getters: true,
  },
  timestamps: true,
})
export class Brand extends BaseEntity {
  // Thay thế Category thành Brand ở đây
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop()
  @IsString()
  @IsOptional()
  image?: string;

  @Prop()
  description?: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand); // Thay thế CategorySchema thành BrandSchema ở đây
export const BrandSchemaFactory = () => {
  // Thay thế CategorySchemaFactory thành BrandSchemaFactory ở đây
  const brandSchema = BrandSchema;
  return brandSchema;
};
