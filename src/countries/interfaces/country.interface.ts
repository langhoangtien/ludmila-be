import { BaseRepositoryInterface } from '../../base/repositories/base.repository.interface';

import { Country } from '../entities/country.entity';

export interface CountriesRepositoryInterface
  extends BaseRepositoryInterface<Country> {}
