import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductSchemaFactory } from './entities/product.entity';
import { ProductsRepository } from './repositories/product.repository';
import { ProductVariantsModule } from '../product-variants/product-variants.module';
import {
  ProductVariant,
  ProductVariantSchema,
} from '../product-variants/entities/product-variant.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Product',
        useFactory: ProductSchemaFactory,
        inject: [getModelToken(ProductVariant.name)],
        imports: [
          MongooseModule.forFeature([
            { name: ProductVariant.name, schema: ProductVariantSchema },
          ]),
        ],
      },
    ]),
    ProductVariantsModule,
    CategoriesModule,
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,

    {
      provide: 'ProductsRepositoryInterface',
      useClass: ProductsRepository,
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
