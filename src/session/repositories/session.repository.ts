import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from '../../base/repositories/base.repository.abstract';

import { Session, SessionDocument } from '../entities/session.entity';
import { SessionsRepositoryInterface } from '../interfaces/session.interface';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class SessionsRepository
  extends BaseRepositoryAbstract<SessionDocument>
  implements SessionsRepositoryInterface
{
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
  ) {
    super(sessionModel);
  }

  async sessionSoftDelete({
    excludeId,
    ...criteria
  }: {
    id?: Session['id'];
    user?: Pick<User, 'id'>;
    excludeId?: Session['id'];
  }): Promise<void> {
    const transformedCriteria = {
      user: criteria.user?.id,
      _id: criteria.id
        ? criteria.id.toString()
        : excludeId
          ? { $not: { $eq: excludeId.toString() } }
          : undefined,
    };
    await this.sessionModel.deleteMany(transformedCriteria);
  }
}
