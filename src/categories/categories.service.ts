import { Inject, Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { BaseServiceAbstract } from '../base/services/base.service.abstract';
import { CategoriesRepositoryInterface } from './interfaces/category.interface';
import { NullableType } from '../utils/types/nullable.type';
import { mongo, ObjectId } from 'mongoose';

@Injectable()
export class CategoriesService extends BaseServiceAbstract<Category> {
  constructor(
    @Inject('CategoriesRepositoryInterface')
    private readonly categoryRepository: CategoriesRepositoryInterface,
  ) {
    super(categoryRepository);
  }
  async createCategory(
    createDto: Category | any,
  ): Promise<NullableType<Category>> {
    let categoryParent: NullableType<Category> = null;
    if (createDto.parentId)
      categoryParent = await this.categoryRepository.findOneById(
        createDto.parentId,
      );

    if (!categoryParent) return null;
    const category = await this.categoryRepository.create(createDto);
    if (categoryParent) {
      category.path = `${categoryParent.path}/${category._id.toString()}`;
    } else {
      category.path = category._id.toString();
    }
    return this.categoryRepository.update(category._id.toString(), category);
  }
  async updateCategory(
    id,
    updateDto: Category | any,
  ): Promise<NullableType<Category>> {
    let categoryParent: NullableType<Category> = null;
    if (updateDto.parentId) {
      categoryParent = await this.categoryRepository.findOneById(
        updateDto.parentId,
      );
    }
    const path = categoryParent
      ? `${categoryParent.path}/${id.toString()}`
      : id;
    updateDto.path = path;
    const categoryChildren = await this.categoryRepository.find({
      path: { $regex: `^${id}` },
    });
    const categoryChildrenUpdate = categoryChildren.map(async (item) => {
      const pathChild = `${path}/${item._id.toString()}`;
      return this.categoryRepository.update(item._id.toString(), {
        path: pathChild,
      });
    });
    await Promise.all(categoryChildrenUpdate);
    return this.categoryRepository.update(id, updateDto);
  }
  async findById(id: string): Promise<NullableType<Category>> {
    const categories = await this.categoryRepository.aggregate([
      {
        $match: {
          _id: new mongo.ObjectId(id),
          deletedAt: null,
        },
      },
      {
        $skip: 0,
      },
      {
        $limit: 4,
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: 'parentId',
          as: 'childrens',
        },
      },
    ]);
    return categories ? categories[0] : null;
  }
  async getCategoriesWithChild(
    parentId: ObjectId | null = null,
  ): Promise<Category[]> {
    return this.categoryRepository.aggregate([
      {
        $match: {
          parentId: parentId,
          deletedAt: null,
        },
      },
      {
        $skip: 0,
      },
      {
        $limit: 4,
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: 'parentId',
          as: 'children',
        },
      },
    ]);
  }
}
