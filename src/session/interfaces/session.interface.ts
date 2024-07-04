import { BaseRepositoryInterface } from '../../base/repositories/base.repository.interface';
import { Session } from '../entities/session.entity';

export interface SessionsRepositoryInterface
  extends BaseRepositoryInterface<Session> {
  sessionSoftDelete(params: any): Promise<any>;
}
