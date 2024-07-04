import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../../base/entities/base.entity';

export type VendorDocument = HydratedDocument<Vendor>;
@Schema({
  toObject: {
    virtuals: true,
    getters: true,
  },
  timestamps: true,
})
export class Vendor extends BaseEntity {
  // Thay đổi từ 'Category' thành 'Vendor'
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor); // Thay đổi từ 'CategorySchema' thành 'VendorSchema'
export const VendorSchemaFactory = () => {
  const vendorSchema = VendorSchema; // Thay đổi từ 'CategorySchema' thành 'VendorSchema'
  return vendorSchema;
};
