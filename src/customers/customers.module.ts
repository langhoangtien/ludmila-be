import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomerSchemaFactory } from './entities/customer.entity';
import { CustomersRepository } from './repositories/customer.repository';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: 'Customer', useFactory: CustomerSchemaFactory },
    ]),
  ],
  controllers: [CustomersController],
  providers: [
    CustomersService,
    {
      provide: 'CustomersRepositoryInterface',
      useClass: CustomersRepository,
    },
  ],
  exports: [CustomersService, CustomersModule],
})
export class CustomersModule {}
