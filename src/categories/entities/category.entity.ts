import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../../base/entities/base.entity';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
  toObject: {
    virtuals: true,
    getters: true,
  },
  timestamps: true,
})
export class Category extends BaseEntity {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  })
  parentId: Category | null; // Kiểu dữ liệu của parentId là một Category hoặc null
}

export const CategorySchema = SchemaFactory.createForClass(Category);
export const CategorySchemaFactory = () => {
  const categorySchema = CategorySchema;
  return categorySchema;
};
