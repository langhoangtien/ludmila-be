import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../../base/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

export enum RATING {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

export type CommentDocument = HydratedDocument<Comment>;
@Schema({
  toObject: {
    virtuals: true,
    getters: true,
  },
  timestamps: true,
})
export class Comment extends BaseEntity {
  @Prop({ required: true })
  content: string;

  @Prop()
  phoneNumber?: string;

  @Prop()
  fullName?: string;

  @Prop({ enum: RATING })
  rating?: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  })
  productId: Product;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId?: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
export const CommentSchemaFactory = () => {
  const commentSchema = CommentSchema;
  return commentSchema;
};
