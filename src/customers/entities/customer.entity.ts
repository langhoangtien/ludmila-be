import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../../base/entities/base.entity';

export type CustomerDocument = HydratedDocument<Customer>;

export enum GENDER {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Schema({
  toObject: {
    virtuals: true,
    getters: true,
  },
  timestamps: true,
})
export class Customer extends BaseEntity {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ default: GENDER.OTHER, enum: GENDER })
  gender: GENDER;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
export const CustomerSchemaFactory = () => {
  const customerSchema = CustomerSchema;
  return customerSchema;
};
