import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BrandsController } from './brands.controller'; // Thay thế CategoriesController thành BrandsController ở đây
import { BrandsService } from './brands.service'; // Thay thế CategoriesService thành BrandsService ở đây
import { BrandSchemaFactory } from './entities/brand.entity'; // Thay thế CategorySchemaFactory thành BrandSchemaFactory ở đây
import { BrandsRepository } from './repositories/brand.repository'; // Thay thế CategoriesRepository thành BrandsRepository ở đây

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: 'Brand', useFactory: BrandSchemaFactory }, // Thay thế Category thành Brand ở đây
    ]),
  ],
  controllers: [BrandsController], // Thay thế CategoriesController thành BrandsController ở đây
  providers: [
    BrandsService, // Thay thế CategoriesService thành BrandsService ở đây
    {
      provide: 'BrandsRepositoryInterface', // Thay thế CategoriesRepositoryInterface thành BrandsRepositoryInterface ở đây
      useClass: BrandsRepository, // Thay thế CategoriesRepository thành BrandsRepository ở đây
    },
  ],
  exports: [BrandsService, BrandsModule], // Thay thế CategoriesService và CategoriesModule thành BrandsService và BrandsModule ở đây
})
export class BrandsModule {} // Thay thế CategoriesModule thành BrandsModule ở đây
