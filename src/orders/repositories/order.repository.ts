import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from '../../base/repositories/base.repository.abstract';
import { Order, OrderDocument } from '../entities/order.entity';
import { OrdersRepositoryInterface } from '../interfaces/order.interface';
@Injectable()
export class OrdersRepository
  extends BaseRepositoryAbstract<OrderDocument>
  implements OrdersRepositoryInterface
{
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {
    super(orderModel);
  }
}
