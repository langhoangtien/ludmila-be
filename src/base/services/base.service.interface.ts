import { FindAllResponse } from '../../utils/types/find-all-reponse.type';
import { NullableType } from '../../utils/types/nullable.type';

export interface Write<T> {
  create(createDto: T | any): Promise<T>;
  update(id: string, updateDto: Partial<T>): Promise<NullableType<T>>;
  updateMany(filter: object, update: object, options?: object): Promise<any>;
  remove(id: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  removeMany(ids: string[]): Promise<any>;
}

export interface Read<T> {
  find(
    filter?: object,
    projection?: string | object,
    options?: object,
  ): Promise<T[]>;
  findAll(
    filter?: object,
    projection?: string | object,
    options?: object,
  ): Promise<FindAllResponse<T>>;
  findOne(filter: Partial<T>): Promise<NullableType<T>>;
  findById(id: string): Promise<NullableType<T>>;
  findOneByCondition(filter: Partial<T>): Promise<NullableType<T>>;
}

export interface BaseServiceInterface<T> extends Write<T>, Read<T> {}
