import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from '../../base/repositories/base.repository.abstract';
import { User, UserDocument } from '../entities/user.entity';
import { UsersRepositoryInterface } from '../interfaces/user.interface';

@Injectable()
export class UsersRepository
  extends BaseRepositoryAbstract<UserDocument>
  implements UsersRepositoryInterface
{
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}
