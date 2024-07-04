import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { BaseRepositoryAbstract } from '../../base/repositories/base.repository.abstract';
import { FindAllResponse } from '../../utils/types/find-all-reponse.type';
import { Vendor, VendorDocument } from '../entities/vendor.entity'; // Thay đổi từ 'Category' thành 'Vendor'
import { VendorsRepositoryInterface } from '../interfaces/vendor.interface'; // Thay đổi từ 'CategoriesRepositoryInterface' thành 'VendorsRepositoryInterface'

@Injectable() // Thay đổi từ 'CategoriesRepository' thành 'VendorsRepository'
// Thay đổi từ 'CategoryDocument' thành 'VendorDocument'
// Thay đổi từ 'CategoriesRepositoryInterface' thành 'VendorsRepositoryInterface'
export class VendorsRepository
  extends BaseRepositoryAbstract<VendorDocument>
  implements VendorsRepositoryInterface
{
  constructor(
    @InjectModel(Vendor.name) // Thay đổi từ 'Category.name' thành 'Vendor.name'
    private readonly vendorModel: Model<VendorDocument>, // Thay đổi từ 'categoryModel' thành 'vendorModel'
  ) {
    super(vendorModel); // Thay đổi từ 'categoryModel' thành 'vendorModel'
  }

  async findAllWithSubFields(
    condition?: FilterQuery<VendorDocument>, // Thay đổi từ 'CategoryDocument' thành 'VendorDocument'
    projection?: object,
    // populate?: string[] | PopulateOptions | PopulateOptions[],
  ): Promise<FindAllResponse<VendorDocument>> {
    const [count, items] = await Promise.all([
      this.vendorModel.countDocuments({ ...condition, deletedAt: null }), // Thay đổi từ 'Category' thành 'Vendor'
      this.vendorModel.find({ ...condition, deletedAt: null }, projection),
      // .populate(populate),
    ]);
    return {
      count,
      items,
    };
  }
}
