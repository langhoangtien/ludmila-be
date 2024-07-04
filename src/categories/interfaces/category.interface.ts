import { BaseRepositoryInterface } from '../../base/repositories/base.repository.interface';
import { Category } from '../entities/category.entity';

export interface CategoriesRepositoryInterface
  extends BaseRepositoryInterface<Category> {}
