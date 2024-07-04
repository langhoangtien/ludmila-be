import { Inject, Injectable } from '@nestjs/common';
import { Customer } from './entities/customer.entity';
import { BaseServiceAbstract } from '../base/services/base.service.abstract';
import { CustomersRepositoryInterface } from './interfaces/customer.interface';

@Injectable()
export class CustomersService extends BaseServiceAbstract<Customer> {
  constructor(
    @Inject('CustomersRepositoryInterface')
    private readonly customerRepository: CustomersRepositoryInterface,
  ) {
    super(customerRepository);
  }
}
