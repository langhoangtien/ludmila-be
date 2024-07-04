import { Inject, Injectable } from '@nestjs/common';
import { ProductVariant } from './entities/product-variant.entity';
import { BaseServiceAbstract } from '../base/services/base.service.abstract';
import { ProductVariantsRepositoryInterface } from './interfaces/product-variant.interface';

@Injectable()
export class ProductVariantsService extends BaseServiceAbstract<ProductVariant> {
  constructor(
    @Inject('ProductVariantsRepositoryInterface')
    private readonly productVariantRepository: ProductVariantsRepositoryInterface,
  ) {
    super(productVariantRepository);
  }
}
