import { BaseRepositoryInterface } from '../../base/repositories/base.repository.interface';
import { Order } from '../entities/order.entity';

export interface OrdersRepositoryInterface
  extends BaseRepositoryInterface<Order> {}
