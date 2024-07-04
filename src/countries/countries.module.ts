import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountriesController } from './countries.controller'; // Sửa từ 'CategoriesController' thành 'CountriesController'
import { CountriesService } from './countries.service'; // Sửa từ 'CategoriesService' thành 'CountriesService'
import { CountrySchemaFactory } from './entities/country.entity'; // Sửa từ 'CategorySchemaFactory' thành 'CountrySchemaFactory'
import { CountriesRepository } from './repositories/country.repository'; // Sửa từ 'CategoriesRepository' thành 'CountriesRepository'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: 'Country', useFactory: CountrySchemaFactory }, // Sửa từ 'Category' thành 'Country'
    ]),
  ],
  controllers: [CountriesController], // Sửa từ 'CategoriesController' thành 'CountriesController'
  providers: [
    CountriesService, // Sửa từ 'CategoriesService' thành 'CountriesService'
    {
      provide: 'CountriesRepositoryInterface', // Sửa từ 'CategoriesRepositoryInterface' thành 'CountriesRepositoryInterface'
      useClass: CountriesRepository, // Sửa từ 'CategoriesRepository' thành 'CountriesRepository'
    },
  ],
  exports: [CountriesService], // Sửa từ 'CategoriesService' thành 'CountriesService'
})
export class CountriesModule {} // Sửa từ 'CategoriesModule' thành 'CountriesModule'
