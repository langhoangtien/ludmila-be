import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { CategoriesService } from '../categories/categories.service';
import { BrandsService } from '../brands/brands.service';
import { CountriesService } from '../countries/countries.service';
import { ProductsService } from '../products/products.service';
import { PagesService } from '../pages/pages.service';

@Injectable()
export class HomeService {
  constructor(
    private configService: ConfigService<AllConfigType>,
    private categoryService: CategoriesService,
    private brandService: BrandsService,
    private countryService: CountriesService,
    private productService: ProductsService,
    private pageService: PagesService,
  ) {}

  appInfo() {
    return { name: this.configService.get('app.name', { infer: true }) };
  }

  async getProductReferenceData() {
    const categories = await this.categoryService.find();
    const brands = await this.brandService.find();
    const countries = await this.countryService.find();
    const data = await Promise.all([categories, brands, countries]);
    return { categories: data[0], brands: data[1], countries: data[2] };
  }

  async getMenu() {
    const pages = await this.pageService.find({
      limit: 6,
      skip: 0,
      orderBy: 'createdAt',
      order: 1,
    });
    const menu = await this.categoryService.getCategoriesWithChild();
    return { pages: pages, menu: menu };
  }
  async getHomeData() {
    const topDiscountProducts = await this.productService.aggregate({
      skip: 0,
      limit: 5,
      sort: { discount: -1 },
      filter: {},
    });
    const topNewestProducts = await this.productService.aggregate({
      skip: 0,
      limit: 20,
      sort: { createdAt: -1 },
      filter: {},
    });
    return {
      topDiscountProducts: topDiscountProducts.items,
      topNewestProducts: topNewestProducts.items,
    };
  }
}
