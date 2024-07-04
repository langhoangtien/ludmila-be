import { BaseRepositoryInterface } from '../../base/repositories/base.repository.interface';
import { Customer } from '../entities/customer.entity';

export interface CustomersRepositoryInterface
  extends BaseRepositoryInterface<Customer> {}
