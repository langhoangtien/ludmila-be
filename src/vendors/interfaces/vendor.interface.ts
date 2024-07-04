import { BaseRepositoryInterface } from '../../base/repositories/base.repository.interface';
import { Vendor } from '../entities/vendor.entity'; // Thay đổi từ 'Category' thành 'Vendor'

export interface VendorsRepositoryInterface // Thay đổi từ 'CategoriesRepositoryInterface' thành 'VendorsRepositoryInterface'
  extends BaseRepositoryInterface<Vendor> {}
