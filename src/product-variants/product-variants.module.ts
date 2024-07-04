import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductVariantsService } from './product-variants.service';
import { ProductVariantSchemaFactory } from './entities/product-variant.entity';
import { ProductVariantsRepository } from './repositories/product-variant.repository';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: 'ProductVariant', useFactory: ProductVariantSchemaFactory },
    ]),
    forwardRef(() => ProductsModule),
  ],

  providers: [
    ProductVariantsService,
    {
      provide: 'ProductVariantsRepositoryInterface',
      useClass: ProductVariantsRepository,
    },
  ],
  exports: [ProductVariantsService],
})
export class ProductVariantsModule {}
