import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from '../../base/repositories/base.repository.abstract';
import { Customer, CustomerDocument } from '../entities/customer.entity';
import { CustomersRepositoryInterface } from '../interfaces/customer.interface';

@Injectable()
export class CustomersRepository
  extends BaseRepositoryAbstract<CustomerDocument>
  implements CustomersRepositoryInterface
{
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {
    super(customerModel);
  }
}
