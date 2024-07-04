import { BaseRepositoryInterface } from '../../base/repositories/base.repository.interface';
import { Brand } from '../entities/brand.entity';

export interface BrandsRepositoryInterface
  extends BaseRepositoryInterface<Brand> {}
