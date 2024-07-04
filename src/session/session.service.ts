import { Inject, Injectable } from '@nestjs/common';
import { Session } from './entities/session.entity';
import { BaseServiceAbstract } from '../base/services/base.service.abstract';
import { SessionsRepositoryInterface } from './interfaces/session.interface';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SessionService extends BaseServiceAbstract<Session> {
  constructor(
    @Inject('SessionsRepositoryInterface')
    private readonly sessionRepository: SessionsRepositoryInterface,
  ) {
    super(sessionRepository);
  }

  async sessionSoftDelete(criteria: {
    id?: Session['id'];
    user?: Pick<User, 'id'>;
    excludeId?: Session['id'];
  }): Promise<void> {
    await this.sessionRepository.sessionSoftDelete(criteria);
  }
}
