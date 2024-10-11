import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InfoDocument = HydratedDocument<Info>;

@Schema()
export class Info {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  value: string;
}

export const InfosSchema = SchemaFactory.createForClass(Info);
