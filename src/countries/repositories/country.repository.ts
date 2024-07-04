import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { BaseRepositoryAbstract } from '../../base/repositories/base.repository.abstract';
import { FindAllResponse } from '../../utils/types/find-all-reponse.type';
import { Country, CountryDocument } from '../entities/country.entity'; // Sửa từ 'Category' thành 'Country'
import { CountriesRepositoryInterface } from '../interfaces/country.interface'; // Sửa từ 'CategoriesRepositoryInterface' thành 'CountriesRepositoryInterface'

@Injectable() // Sửa từ 'CategoriesRepository' thành 'CountriesRepository'
// Sửa từ 'CategoriesRepositoryInterface' thành 'CountriesRepositoryInterface'
export class CountriesRepository
  extends BaseRepositoryAbstract<CountryDocument>
  implements CountriesRepositoryInterface
{
  constructor(
    @InjectModel(Country.name) // Sửa từ 'Category.name' thành 'Country.name'
    private readonly countryModel: Model<CountryDocument>, // Sửa từ 'categoryModel' thành 'countryModel'
  ) {
    super(countryModel); // Sửa từ 'categoryModel' thành 'countryModel'
  }

  async findAllWithSubFields(
    condition?: FilterQuery<CountryDocument>, // Sửa từ 'CategoryDocument' thành 'CountryDocument'
    projection?: object,
    // populate?: string[] | PopulateOptions | PopulateOptions[],
  ): Promise<FindAllResponse<CountryDocument>> {
    const [count, items] = await Promise.all([
      this.countryModel.countDocuments({ ...condition, deletedAt: null }), // Sửa từ 'Category' thành 'Country'
      this.countryModel.find({ ...condition, deletedAt: null }, projection),
      // .populate(populate),
    ]);
    return {
      count,
      items,
    };
  }
}
