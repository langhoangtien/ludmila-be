import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from '../../base/repositories/base.repository.abstract';
import { Brand, BrandDocument } from '../entities/brand.entity'; // Thay thế Category bằng Brand
import { BrandsRepositoryInterface } from '../interfaces/brand.interface'; // Thay thế Category bằng Brand

@Injectable() // Thay thế CategoryDocument bằng BrandDocument
// Thay thế CategoriesRepositoryInterface bằng BrandsRepositoryInterface
export class BrandsRepository
  extends BaseRepositoryAbstract<BrandDocument>
  implements BrandsRepositoryInterface
{
  constructor(
    @InjectModel(Brand.name) // Thay thế Category.name bằng Brand.name
    private readonly brandModel: Model<BrandDocument>, // Thay thế CategoryDocument bằng BrandDocument
  ) {
    super(brandModel); // Thay thế categoryModel bằng brandModel
  }
}
