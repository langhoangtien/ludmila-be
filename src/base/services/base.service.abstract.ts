import { FindAllResponse } from '../../utils/types/find-all-reponse.type';
import { BaseEntity } from '../entities/base.entity';
import { BaseRepositoryInterface } from '../repositories/base.repository.interface';
import { BaseServiceInterface } from './base.service.interface';

export abstract class BaseServiceAbstract<T extends BaseEntity>
  implements BaseServiceInterface<T>
{
  constructor(private readonly repository: BaseRepositoryInterface<T>) {}

  async create(createDto: T | any): Promise<T> {
    return await this.repository.create(createDto);
  }

  async findAll(
    filter?: object,
    projection?: string | object,
    options?: object,
  ): Promise<FindAllResponse<T>> {
    return await this.repository.findAll(filter, projection, options);
  }

  async find(
    filter?: object,
    projection?: object,
    options?: object,
  ): Promise<T[]> {
    const updatedProjection = { ...projection, deletedAt: 0 };
    return await this.repository.find(filter, updatedProjection, options);
  }
  async findAllWithPagination({
    limit,
    skip,
    filter,
    sort,
    populate,
    projection,
  }: {
    limit: number;
    skip: number;
    filter: any;
    sort: any;
    populate?: any[];
    projection?: object;
  }): Promise<FindAllResponse<T>> {
    console.log('SORT2', sort);

    return await this.repository.findAll(filter, projection, {
      limit,
      skip,
      sort,
      populate,
    });
  }
  async findOne(filter: Partial<T>) {
    return await this.repository.findOne(filter);
  }

  async findById(id: string) {
    return await this.repository.findById(id);
  }
  async aggregate(pipeline?, options?) {
    return await this.repository.aggregate(pipeline, options);
  }
  async findOneByCondition(filter: Partial<T>) {
    return await this.repository.findOneByCondition(filter);
  }

  async update(id: string, updateDto: Partial<T> | any) {
    return await this.repository.update(id, updateDto);
  }
  async updateMany(filter: object, update: object, options?: object) {
    return await this.repository.updateMany(filter, update, options);
  }

  async remove(id: string) {
    return await this.repository.softDelete(id);
  }
  async delete(id: string) {
    return await this.repository.permanentlyDelete(id);
  }
  async removeMany(ids: string[]) {
    return await this.repository.softDeleteMany(ids);
  }
}
