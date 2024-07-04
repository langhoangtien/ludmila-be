import { Inject, Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { BaseServiceAbstract } from '../base/services/base.service.abstract';
import { CategoriesRepositoryInterface } from './interfaces/category.interface';

@Injectable()
export class CategoriesService extends BaseServiceAbstract<Category> {
  constructor(
    @Inject('CategoriesRepositoryInterface')
    private readonly categoryRepository: CategoriesRepositoryInterface,
  ) {
    super(categoryRepository);
  }
}
