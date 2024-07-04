import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategorySchemaFactory } from './entities/category.entity';
import { CategoriesRepository } from './repositories/category.repository';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: 'Category', useFactory: CategorySchemaFactory },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: 'CategoriesRepositoryInterface',
      useClass: CategoriesRepository,
    },
  ],
  exports: [CategoriesService, CategoriesModule],
})
export class CategoriesModule {}
