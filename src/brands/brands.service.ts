import { Inject, Injectable } from '@nestjs/common';
import { Brand } from './entities/brand.entity'; // Thay thế Category thành Brand ở đây
import { BaseServiceAbstract } from '../base/services/base.service.abstract';
import { BrandsRepositoryInterface } from './interfaces/brand.interface'; // Thay thế CategoriesRepositoryInterface thành BrandsRepositoryInterface ở đây

@Injectable()
export class BrandsService extends BaseServiceAbstract<Brand> {
  // Thay thế CategoriesService thành BrandsService ở đây
  constructor(
    @Inject('BrandsRepositoryInterface') // Thay thế CategoriesRepositoryInterface thành BrandsRepositoryInterface ở đây
    private readonly brandRepository: BrandsRepositoryInterface, // Thay thế categoryRepository thành brandRepository ở đây
  ) {
    super(brandRepository);
  }
}
