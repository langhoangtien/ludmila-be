import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { BaseQueryDto, RemoveManyQueryDto } from '../base/dto/base.dto';
import { NullableType } from '../utils/types/nullable.type';
import { CreateProductRatingDto } from './dto/create-rating.dto';
import mongoose from 'mongoose';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { ROLE } from '../users/entities/user.entity';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { Public } from '../auth/decorators/auth.decorator';

@ApiTags('Products')
@Controller({ path: 'products', version: '1' })
@Roles(ROLE.ADMIN)
@UseGuards(JwtAccessTokenGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Tạo sản phẩm
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Public()
  findAll(@Query() query: BaseQueryDto<Product>): Promise<any> {
    const brand = query?.filterRaw?.brand ?? undefined;
    const category = query?.filterRaw?.category ?? undefined;
    const country = query?.filterRaw?.country ?? undefined;
    const price = query?.filterRaw?.price ?? undefined;
    const rating = query?.filterRaw?.rating ?? undefined;
    const search = query?.filterRaw?.search ?? undefined;
    let filterObject: any = { ...query?.filter };
    if (rating) {
      const ratingFilter = { ratingAverage: { $gte: +rating } };
      filterObject = { ...filterObject, ...ratingFilter };
    }

    if (brand && brand.length > 0) {
      const brandFilter = {
        brand: {
          $in: brand.map((item) => new mongoose.Types.ObjectId(item)),
        },
      };

      filterObject = { ...filterObject, ...brandFilter };
    }
    if (search) {
      const searchFilter = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { slug: { $regex: search, $options: 'i' } },
        ],
      };
      filterObject = { ...filterObject, ...searchFilter };
    }
    if (category && category.length > 0) {
      const categoryFilter = {
        category: {
          $in: category.map((item) => new mongoose.Types.ObjectId(item)),
        },
      };
      filterObject = { ...filterObject, ...categoryFilter };
    }
    if (country && country.length > 0) {
      const countryFilter = {
        country: {
          $in: country.map((item) => new mongoose.Types.ObjectId(item)),
        },
      };
      filterObject = { ...filterObject, ...countryFilter };
    }

    let priceFilter: any = null;

    if (price && price.length > 0) {
      priceFilter = {
        $match: {
          $or: price.map((item) => {
            const [min, max] = item.split('-').map((item) => parseInt(item));
            if (isNaN(max)) return { salePrice: { $gte: min } };
            return { salePrice: { $gte: min, $lte: max } };
          }),
        },
      };
    }
    // filterArray.push(priceFilter);
    // console.log(priceFilter.$match.$or);

    const filter = filterObject;
    const sortQuery = query?.sort ?? { orderBy: 'createdAt', order: -1 };
    if (sortQuery.order === '1' || sortQuery.order === 'ASC')
      sortQuery.order = 1;
    else sortQuery.order = -1;
    const sort = {
      [sortQuery.orderBy]: sortQuery.order,
    };
    return this.productsService.aggregate({
      skip: query?.skip ?? 0,
      limit: query?.limit ?? 10,
      filter,
      sort,
      priceFilter,
    });
  }

  // Lấy 1 sản phẩm
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: string): Promise<NullableType<Product>> {
    return this.productsService.findProductById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<NullableType<Product>> {
    return this.productsService.update(id, updateProductDto);
  }
  // Cập nhật sản phẩm

  @Patch('add-star/:id')
  @HttpCode(HttpStatus.OK)
  updateStar(
    @Param('id') id: string,
    @Body() createProductRatingDto: CreateProductRatingDto,
  ): Promise<NullableType<Product>> {
    return this.productsService.addRating(id, createProductRatingDto);
  }

  @Delete('remove-many')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMany(@Query() query: RemoveManyQueryDto) {
    console.log(query);

    return this.productsService.removeMany(query.ids);
  }

  // Xóa vĩnh viễn
  @Delete('delete/:id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }

  // Xóa 1 sản phẩm
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
