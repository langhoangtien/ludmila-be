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
  async getCategoriesWithChild() {
    return this.categoryRepository.aggregate([
      {
        $match: {
          parentId: null,
          deletedAt: null,
        },
      },
      {
        $skip: 0,
      },
      {
        $limit: 4,
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: 'parentId',
          as: 'children',
        },
      },
    ]);
  }
}
