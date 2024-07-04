import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderSchemaFactory } from './entities/order.entity';
import { OrdersRepository } from './repositories/order.repository';
import { ProductVariantsModule } from '../product-variants/product-variants.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: 'Order', useFactory: OrderSchemaFactory },
    ]),
    ProductVariantsModule,
    CustomersModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: 'OrdersRepositoryInterface',
      useClass: OrdersRepository,
    },
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
