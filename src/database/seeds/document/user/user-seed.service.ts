import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { ROLE, STATUS, User } from '../../../../users/entities/user.entity';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectModel(User.name)
    private readonly model: Model<User>,
  ) {}

  async run() {
    const admin = await this.model.findOne({
      email: 'admin@example.com',
    });

    if (!admin) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      const data = new this.model({
        email: 'admin@example.com',
        password: password,
        firstName: 'Super',
        lastName: 'Admin',
        role: ROLE.ADMIN,
        status: STATUS.ACTIVE,
      });
      await data.save();
    }

    const user = await this.model.findOne({
      email: 'john.doe@example.com',
    });

    if (!user) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      const data = new this.model({
        email: 'john.doe@example.com',
        password: password,
        firstName: 'John',
        lastName: 'Doe',
        role: ROLE.USER,
        status: STATUS.ACTIVE,
      });

      await data.save();
    }
  }
}
