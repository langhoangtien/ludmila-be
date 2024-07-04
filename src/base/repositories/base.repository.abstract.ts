import mongoose, {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
} from 'mongoose';
import { BaseEntity } from '../entities/base.entity';
import { BaseRepositoryInterface } from './base.repository.interface';
import { FindAllResponse } from '../../utils/types/find-all-reponse.type';
import { NullableType } from '../../utils/types/nullable.type';
export abstract class BaseRepositoryAbstract<T extends BaseEntity>
  implements BaseRepositoryInterface<T>
{
  protected constructor(private readonly model: Model<T>) {
    this.model = model;
  }

  create(dto: T | any): Promise<T> {
    return this.model.create(dto);
  }

  async findOneById(
    id: string,
    projection?: string,
    options?: QueryOptions<T>,
  ): Promise<NullableType<T>> {
    const item = await this.model.findById(id, projection, options);

    return item;
  }

  async findOneByCondition(condition = {}): Promise<NullableType<T>> {
    return await this.model
      .findOne({
        ...condition,
        deletedAt: null,
      })
      .exec();
  }

  async findOne(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<NullableType<T>> {
    // if (condition.id) condition._id = condition.id;
    return await this.model.findOne(
      {
        ...filter,
        deletedAt: null,
      },
      projection,
      options,
    );
  }

  findById(id: string): Promise<NullableType<T>> {
    return this.model.findById(id).where('deletedAt').equals(null).exec();
  }

  async findAll(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<FindAllResponse<T>> {
    console.log(options);

    const [count, items] = await Promise.all([
      this.model.countDocuments({ ...filter, deletedAt: null }),
      this.model.find({ ...filter, deletedAt: null }, projection, options),
    ]);
    return {
      count,
      items,
    };
  }

  find(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T[]> {
    return this.model.find(filter, projection, options);
  }

  async findAllWithPagination({
    skip,
    limit,
    filter,
    sort,
    populate,
    projection,
  }) {
    const [count, items] = await Promise.all([
      this.model.countDocuments({ ...filter, deletedAt: null }),
      this.model.find({ ...filter, deletedAt: null }, projection, {
        limit,
        populate,
        skip,
        sort,
      }),
    ]);
    return {
      count,
      items,
    };
  }
  async aggregate(pipeline, options) {
    return await this.model.aggregate(pipeline, options);
  }

  async update(
    id: string | mongoose.Types.ObjectId,
    dto: Partial<T>,
  ): Promise<NullableType<T>> {
    await this.model
      .updateOne({ _id: id, deletedAt: null }, dto, { new: true })
      .exec();
    return await this.model.findById(id).exec();
  }
  async updateMany(
    filter: object,
    update: object,
    options?: object,
  ): Promise<any> {
    await this.model.updateMany(filter, update, options);
  }

  async softDelete(id: string): Promise<boolean> {
    const deleteItem = await this.model.findById(id);
    if (!deleteItem) {
      return false;
    }

    return !!(await this.model
      .findByIdAndUpdate<T>(id, { deletedAt: new Date() })
      .exec());
  }

  async permanentlyDelete(id: string): Promise<boolean> {
    const deleteItem = await this.model.findById(id);
    if (!deleteItem) {
      return false;
    }
    return !!(await this.model.findOneAndDelete({ _id: id }));
  }

  async softDeleteMany(ids: string[]) {
    return await this.model.updateMany(
      { _id: { $in: ids } },

      { $set: { deletedAt: new Date() } },
    );
  }
}
