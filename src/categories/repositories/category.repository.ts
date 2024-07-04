import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from '../../base/repositories/base.repository.abstract';
import { Category, CategoryDocument } from '../entities/category.entity';
import { CategoriesRepositoryInterface } from '../interfaces/category.interface';

@Injectable()
export class CategoriesRepository
  extends BaseRepositoryAbstract<CategoryDocument>
  implements CategoriesRepositoryInterface
{
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {
    super(categoryModel);
  }
}
