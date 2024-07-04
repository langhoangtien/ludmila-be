import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { BaseRepositoryAbstract } from '../../base/repositories/base.repository.abstract';

import { Product, ProductDocument } from '../entities/product.entity'; // Thay đổi từ 'Category' thành 'Product'
import { ProductsRepositoryInterface } from '../interfaces/product.interface'; // Thay đổi từ 'CategoriesRepositoryInterface' thành 'ProductsRepositoryInterface'

@Injectable()
export class ProductsRepository
  extends BaseRepositoryAbstract<ProductDocument>
  implements ProductsRepositoryInterface
{
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {
    super(productModel);
  }

  aggregate(pipeline, options?) {
    return this.productModel.aggregate(pipeline, options);
  }

  findAndPopulate(
    condition?: FilterQuery<ProductDocument>,
    projection?: string | object,
    options?: object,
  ) {
    return this.productModel.find(condition || {}, projection, options).exec();
  }
}
