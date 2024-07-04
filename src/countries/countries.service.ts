import { Inject, Injectable } from '@nestjs/common';
import { Country } from './entities/country.entity'; // Sửa từ 'Category' thành 'Country'
import { BaseServiceAbstract } from '../base/services/base.service.abstract';
import { CountriesRepositoryInterface } from './interfaces/country.interface'; // Sửa từ 'CategoriesRepositoryInterface' thành 'CountriesRepositoryInterface'

@Injectable()
export class CountriesService extends BaseServiceAbstract<Country> {
  // Sửa từ 'CategoriesService' thành 'CountriesService'
  constructor(
    @Inject('CountriesRepositoryInterface') // Sửa từ 'CategoriesRepositoryInterface' thành 'CountriesRepositoryInterface'
    private readonly countryRepository: CountriesRepositoryInterface, // Sửa từ 'categoryRepository' thành 'countryRepository'
  ) {
    super(countryRepository);
  }
}
