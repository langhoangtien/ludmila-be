import { FindAllResponse } from '../../utils/types/find-all-reponse.type';
import { NullableType } from '../../utils/types/nullable.type';

export interface BaseRepositoryInterface<T> {
  create(dto: T | any): Promise<T>;
  aggregate(pipeline?: any, options?: any): Promise<any>;

  findOneById(
    id: string,
    projection?: string,
    option?: object,
  ): Promise<NullableType<T>>;

  findById(id: string): Promise<NullableType<T>>;
  findOne(condition?: object, projection?: string): Promise<NullableType<T>>;

  findOneByCondition(
    condition?: object,
    projection?: string,
  ): Promise<NullableType<T>>;

  find(
    condition?: object,
    projection?: string | object,
    options?: object,
  ): Promise<T[]>;
  findAll(
    condition?: object,
    projection?: string | object,
    options?: object,
  ): Promise<FindAllResponse<T>>;

  findAllWithPagination(query): Promise<FindAllResponse<T>>;
  update(id: string, dto: Partial<T>): Promise<NullableType<T>>;
  updateMany(filter: object, update: object, options?: object): any;

  softDelete(id: string): Promise<boolean>;
  softDeleteMany(id: string[]): Promise<any>;

  permanentlyDelete(id: string): Promise<boolean>;
}
