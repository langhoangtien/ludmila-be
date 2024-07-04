import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Đường dẫn đến IsUnique decorator

import { VendorsController } from './vendors.controller'; // Thay đổi từ 'CategoriesController' thành 'VendorsController'
import { VendorsService } from './vendors.service'; // Thay đổi từ 'CategoriesService' thành 'VendorsService'
import { VendorSchemaFactory } from './entities/vendor.entity'; // Thay đổi từ 'CategorySchemaFactory' thành 'VendorSchemaFactory'
import { VendorsRepository } from './repositories/vendor.repository'; // Thay đổi từ 'CategoriesRepository' thành 'VendorsRepository'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: 'Vendor', useFactory: VendorSchemaFactory }, // Thay đổi từ 'Category' thành 'Vendor', 'CategorySchemaFactory' thành 'VendorSchemaFactory'
    ]),
  ],
  controllers: [VendorsController], // Thay đổi từ 'CategoriesController' thành 'VendorsController'
  providers: [
    VendorsService, // Thay đổi từ 'CategoriesService' thành 'VendorsService'
    {
      provide: 'VendorsRepositoryInterface', // Thay đổi từ 'CategoriesRepositoryInterface' thành 'VendorsRepositoryInterface'
      useClass: VendorsRepository, // Thay đổi từ 'CategoriesRepository' thành 'VendorsRepository'
    },
  ],
  exports: [VendorsService, VendorsModule], // Thay đổi từ 'CategoriesService' thành 'VendorsService'
})
export class VendorsModule {} // Thay đổi từ 'CategoriesModule' thành 'VendorsModule'
