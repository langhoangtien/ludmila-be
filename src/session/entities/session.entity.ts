import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../../base/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export type SessionDocument = HydratedDocument<Session>;

@Schema({
  toObject: {
    virtuals: true,
    getters: true,
  },
  timestamps: true,
})
export class Session extends BaseEntity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  hash: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
export const SessionSchemaFactory = () => {
  const sessionSchema = SessionSchema;
  return sessionSchema;
};
