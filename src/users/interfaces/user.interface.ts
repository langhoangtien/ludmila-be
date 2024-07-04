import { BaseRepositoryInterface } from '../../base/repositories/base.repository.interface';
import { User } from '../entities/user.entity';

export interface UsersRepositoryInterface
  extends BaseRepositoryInterface<User> {}
