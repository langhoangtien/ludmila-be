import { Inject, Injectable } from '@nestjs/common';
import { Vendor } from './entities/vendor.entity'; // Thay đổi từ 'Category' thành 'Vendor'
import { BaseServiceAbstract } from '../base/services/base.service.abstract';
import { VendorsRepositoryInterface } from './interfaces/vendor.interface'; // Thay đổi từ 'CategoriesRepositoryInterface' thành 'VendorsRepositoryInterface'

@Injectable()
export class VendorsService extends BaseServiceAbstract<Vendor> {
  // Thay đổi từ 'CategoriesService' thành 'VendorsService'
  constructor(
    @Inject('VendorsRepositoryInterface') // Thay đổi từ 'CategoriesRepositoryInterface' thành 'VendorsRepositoryInterface'
    private readonly vendorRepository: VendorsRepositoryInterface, // Thay đổi từ 'categoryRepository' thành 'vendorRepository'
  ) {
    super(vendorRepository); // Thay đổi từ 'categoryRepository' thành 'vendorRepository'
  }
}
