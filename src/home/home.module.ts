import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from '../categories/categories.module';
import { BrandsModule } from '../brands/brands.module';
import { CountriesModule } from '../countries/countries.module';
import { ProductsModule } from '../products/products.module';
import { PagesModule } from '../pages/pages.module';

@Module({
  imports: [
    ConfigModule,
    CategoriesModule,
    BrandsModule,
    CountriesModule,
    ProductsModule,
    PagesModule,
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
