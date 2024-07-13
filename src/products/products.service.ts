import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity'; // Thay đổi từ 'Category' thành 'Product'
import { BaseServiceAbstract } from '../base/services/base.service.abstract';
import { FindAllResponse } from '../utils/types/find-all-reponse.type';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductVariantsService } from '../product-variants/product-variants.service';
import { ProductsRepository } from './repositories/product.repository';
import * as mongoose from 'mongoose';
import { NullableType } from '../utils/types/nullable.type';

// import { PRODUCT_ALL } from '../fields-query-response/fields-query-response';
import { CreateProductRatingDto } from './dto/create-rating.dto';
import { RATING } from '../comments/entities/comment.entity';

@Injectable()
export class ProductsService extends BaseServiceAbstract<Product> {
  constructor(
    @Inject('ProductsRepositoryInterface')
    private readonly productRepository: ProductsRepository,
    private readonly productVariantSevice: ProductVariantsService,
  ) {
    super(productRepository);
  }

  async create(createDto: CreateProductDto): Promise<Product> {
    const newProduct = await this.productRepository.create(createDto);

    const variants = createDto.variants.map((variant) => ({
      ...variant,
      productId: newProduct._id,
      discount: caculateDiscount(variant.price, variant.salePrice),
    }));
    await this.productVariantSevice.create(variants);

    return newProduct;
  }

  async update(
    id: string,
    updateDto: Partial<Product> | any,
  ): Promise<NullableType<Product>> {
    const oldVariants = await this.productVariantSevice.find({
      productId: new mongoose.Types.ObjectId(id),
    });
    if (oldVariants.length === 0) return null;
    let variantIds = oldVariants.map((variant) => variant._id.toString());

    const variants = updateDto.variants.map(async (variant) => {
      if (variant._id) {
        variantIds = variantIds.filter((id) => variant._id !== id);
        return await this.productVariantSevice.update(variant._id, {
          ...variant,

          discount: caculateDiscount(variant.price, variant.salePrice),
        });
      }

      return await this.productVariantSevice.create({
        ...variant,
        discount: caculateDiscount(variant.price, variant.salePrice),
        productId: oldVariants[0].productId,
      });
    });

    await Promise.all(variants);

    await this.productVariantSevice.updateMany(
      { _id: { $in: variantIds } },
      { $set: { deletedAt: new Date() } },
    );

    return await this.productRepository.update(id, updateDto);
  }
  async findProductById(id: string) {
    const productId = new mongoose.Types.ObjectId(id);
    const product = await this.productRepository.aggregate([
      {
        $match: {
          _id: productId,
          deletedAt: null,
        },
      },
      {
        $lookup: {
          from: 'productvariants',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$productId', '$$productId'] },
                    { $eq: ['$deletedAt', null] },
                  ],
                },
              },
            },
          ],
          as: 'variants',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $lookup: {
          from: 'brands',
          localField: 'brand',
          foreignField: '_id',
          as: 'brand',
        },
      },
      {
        $lookup: {
          from: 'vendors',
          localField: 'vendor',
          foreignField: '_id',
          as: 'vendor',
        },
      },
      {
        $lookup: {
          from: 'countries',
          localField: 'country',
          foreignField: '_id',
          as: 'country',
        },
      },
      {
        $addFields: {
          quantity: { $sum: '$variants.quantity' },
          price: { $min: '$variants.price' },
          discount: { $max: '$variants.discount' },
          salePrice: { $min: '$variants.salePrice' },
        },
      },

      {
        $project: {
          category: { $arrayElemAt: ['$category', 0] },
          vendor: { $arrayElemAt: ['$vendor', 0] },
          country: { $arrayElemAt: ['$country', 0] },
          brand: { $arrayElemAt: ['$brand', 0] },
          image: 1,
          images: 1,
          variants: 1,
          name: 1,
          code: 1,
          slug: 1,
          price: 1,
          discount: 1,
          salePrice: 1,
          quantity: 1,
          introduction: 1,
          description: 1,
          tags: 1,
          barCode: 1,
          createdAt: 1,
          updatedAt: 1,
          attributes: 1,
          sold: 1,
          id: '$_id',
          ratings: 1,
          ratingAverage: 1,
        },
      },
    ]);

    return product[0];
  }
  async aggregate({
    limit,
    skip,
    filter,
    sort,
    priceFilter = null,
  }: {
    limit: number;
    skip: number;
    filter: any;
    sort: any;
    priceFilter?: any;
  }) {
    const countPipeline = [
      {
        $match: {
          ...filter,
          deletedAt: null,
        },
      },
      {
        $lookup: {
          from: 'productvariants',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$productId', '$$productId'] },
                    { $eq: ['$deletedAt', null] },
                  ],
                },
              },
            },
          ],
          as: 'variants',
        },
      },
      {
        $addFields: {
          salePrice: { $min: '$variants.salePrice' },
        },
      },

      {
        $count: 'total',
      },
    ];

    const itemsPipeline = [
      {
        $match: {
          ...filter,
          deletedAt: null,
        },
      },

      {
        $lookup: {
          from: 'productvariants',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$productId', '$$productId'] },
                    { $eq: ['$deletedAt', null] },
                  ],
                },
              },
            },
          ],
          as: 'variants',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },

      {
        $lookup: {
          from: 'vendors',
          localField: 'vendor',
          foreignField: '_id',
          as: 'vendor',
        },
      },
      {
        $lookup: {
          from: 'countries',
          localField: 'country',
          foreignField: '_id',
          as: 'country',
        },
      },
      {
        $lookup: {
          from: 'brands',
          localField: 'brand',
          foreignField: '_id',
          as: 'brand',
        },
      },
      {
        $addFields: {
          category: { $arrayElemAt: ['$category.name', 0] },
          brand: { $arrayElemAt: ['$brand.name', 0] },
          vendor: { $arrayElemAt: ['$vendor.name', 0] },
          country: { $arrayElemAt: ['$country.name', 0] },
          quantity: { $sum: '$variants.quantity' },
          price: { $min: '$variants.price' },
          discount: { $max: '$variants.discount' },
          salePrice: { $min: '$variants.salePrice' },
          maxSalePrice: { $max: '$variants.salePrice' },
        },
      },

      {
        $project: {
          id: '$_id',
          category: 1,
          createdAt: 1,
          updatedAt: 1,
          vendor: 1,
          country: 1,
          brand: 1,
          tags: 1,
          name: 1,
          code: 1,
          slug: 1,
          introduction: 1,
          barCode: 1,
          attributes: 1,
          images: 1,
          image: 1,
          quantity: 1,
          price: 1,
          discount: 1,
          salePrice: 1,
          variants: 1,
          sold: 1,
          _id: 1,
          maxSalePrice: 1,
          ratingAverage: 1,
        },
      },

      {
        $sort: sort,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];
    if (priceFilter) {
      countPipeline.splice(3, 0, priceFilter);
      itemsPipeline.splice(8, 0, priceFilter);
    }
    const totalCount = await this.productRepository.aggregate(countPipeline);

    const items = await this.productRepository.aggregate(itemsPipeline);
    return { count: totalCount[0] ? totalCount[0].total : 0, items };
  }
  async findAllWithPagination({
    limit,
    skip,
    filter,
    sort,
  }: {
    limit: number;
    skip: number;
    filter: any;
    sort: any;
  }): Promise<FindAllResponse<Product>> {
    try {
      const findAllOptions = {
        limit,
        skip,
        sort,
        populate: ['vendor', 'category', 'country', 'brand'],
      };

      const products = await this.productRepository.findAll(
        filter,
        '-description',
        findAllOptions,
      );

      return products;
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  // Thêm 1 rating
  async addRating(id: string, createDto: CreateProductRatingDto) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new BadRequestException();
    const ratings = product?.ratings;
    if (ratings && ratings.length === 5) {
      ratings[createDto.star - 1]++;
      await this.productRepository.update(id, {
        ratings,
      });
    }
    return await this.productRepository.findById(id);
  }
  async updateRating(id: string, rating: RATING) {
    console.log('ratingAverage, ratings');
    const product = await this.productRepository.findById(id);
    if (!product) throw new BadRequestException();

    const ratings = product?.ratings ?? [0, 0, 0, 0, 0];
    ratings[rating - 1]++;

    let totalRating = 0;
    let totalSumRating = 0;
    for (let i = 0; i < ratings.length; i++) {
      totalSumRating += ratings[i] * (i + 1);
      totalRating += ratings[i];
    }

    const ratingAverage = Math.round((totalSumRating / totalRating) * 10) / 10;

    console.log(ratingAverage, ratings);

    return await this.productRepository.update(id, {
      ratingAverage,
      ratings,
    });
  }
}

function caculateDiscount(price: number, salePrice: number) {
  if (price === 0) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}
