import { BaseRepositoryInterface } from '../../base/repositories/base.repository.interface';
import { ProductVariant } from '../entities/product-variant.entity';

export interface ProductVariantsRepositoryInterface
  extends BaseRepositoryInterface<ProductVariant> {}
