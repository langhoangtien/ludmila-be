import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../../base/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { OrderProduct } from './order-product.entity';
import { Type } from 'class-transformer';
import { Customer } from '../../customers/entities/customer.entity';

export type OrderDocument = HydratedDocument<Order>;
export enum ORDER_STATUS {
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  CONFIRMED = 'confirmed',
  NEW = 'new',
  SHIPPING = 'shipping',
  RETURNING = 'returning',
}
export enum PAYMENT_METHOD {
  COD = 'cod',
  MOMO = 'momo',
  VNPAY = 'vnpay',
  BANKING = 'banking',
  PAYPAL = 'paypal',
  VISA = 'visa',
  MASTERCARD = 'mastercard',
}

@Schema({ timestamps: true })
export class Order extends BaseEntity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user?: User;

  @Prop({
    type: [{ type: OrderProduct }],
    required: true,
  })
  @Type(() => OrderProduct)
  products: OrderProduct[];

  @Prop({ required: true, enum: ORDER_STATUS })
  status: ORDER_STATUS;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customerId?: Customer;

  @Prop()
  receiverName: string;

  @Prop({
    validate: {
      validator: (phoneNumber: string) =>
        /^((\+84|84|0)(3|5|7|8|9|1[2689]))([0-9]{8})\b/.test(phoneNumber),
      message: 'Invalid phone number',
    },
  })
  phoneNumber: string;

  @Prop()
  shippingAddress: string;

  @Prop({ required: true })
  shippingFee: number;

  @Prop({ required: true })
  subTotal: number;

  @Prop({ enum: PAYMENT_METHOD, default: PAYMENT_METHOD.COD })
  paymentMethod: PAYMENT_METHOD;

  @Prop({ type: Date })
  deliveredAt?: Date;

  @Prop({ required: true })
  totalPrice: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
export const OrderSchemaFactory = () => {
  const orderSchema = OrderSchema;
  return orderSchema;
};
