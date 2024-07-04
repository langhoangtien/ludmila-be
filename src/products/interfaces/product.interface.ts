import { BaseRepositoryInterface } from '../../base/repositories/base.repository.interface';
import { Product } from '../entities/product.entity'; // Thay đổi từ 'Category' thành 'Product'

export interface ProductsRepositoryInterface // Thay đổi tên interface từ 'CategoriesRepositoryInterface' thành 'ProductsRepositoryInterface'
  extends BaseRepositoryInterface<Product> {}
