import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from '../../base/repositories/base.repository.abstract';
import {
  ProductVariant,
  ProductVariantDocument,
} from '../entities/product-variant.entity';
import { ProductVariantsRepositoryInterface } from '../interfaces/product-variant.interface';

@Injectable()
export class ProductVariantsRepository
  extends BaseRepositoryAbstract<ProductVariantDocument>
  implements ProductVariantsRepositoryInterface
{
  constructor(
    @InjectModel(ProductVariant.name)
    private readonly productVariantModel: Model<ProductVariantDocument>,
  ) {
    super(productVariantModel);
  }
  async createMany(productVariants) {
    await this.productVariantModel.insertMany(productVariants);
  }
}
