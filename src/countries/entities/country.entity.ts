import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../../base/entities/base.entity';

export type CountryDocument = HydratedDocument<Country>;

@Schema({
  toObject: {
    virtuals: true,
    getters: true,
  },
  timestamps: true,
})
export class Country extends BaseEntity {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
export const CountrySchemaFactory = () => {
  const countrySchema = CountrySchema;
  return countrySchema;
};
