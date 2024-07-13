import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity'; // Assuming you have a User entity
import { BaseServiceAbstract } from '../base/services/base.service.abstract';
import { UsersRepositoryInterface } from './interfaces/user.interface'; // Assuming you have a UsersRepositoryInterface
import { CreateUserDto } from './dto/create-user.dto'; // Assuming you have a CreateUserDto
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import bcrypt from 'bcryptjs';
import { FindAllResponse } from '../utils/types/find-all-reponse.type';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService extends BaseServiceAbstract<User> {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly userRepository: UsersRepositoryInterface,
  ) {
    super(userRepository);
  }

  async create(createDto: CreateUserDto): Promise<User> {
    const clonedPayload = { provider: AuthProvidersEnum.email, ...createDto };
    if (clonedPayload.password) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    const user = await this.userRepository.create(clonedPayload); // Changed repository method call
    return user;
  }

  async update(id: string, payload: UpdateUserDto): Promise<User | null> {
    // const clonedPayload = { ...payload };
    // const user = await this.userRepository.findById(id);
    // if (clonedPayload.password && clonedPayload.previousPassword) {
    //   const isMatch = await bcrypt.compare(
    //     clonedPayload.previousPassword,
    //     user?.password || '',
    //   );

    //   if (!isMatch)
    //     throw new UnprocessableEntityException({
    //       status: HttpStatus.UNPROCESSABLE_ENTITY,
    //       errors: {
    //         password: 'incorrect password',
    //       },
    //     });
    //   const salt = await bcrypt.genSalt();
    //   clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    // }
    console.log('payload', payload);

    return await this.userRepository.update(id, payload);
  }

  async findAllWithPagination({
    limit,
    skip,
    filter,
    sort,
  }: {
    limit: number;
    skip: number;
    filter: any;
    sort: any;
  }): Promise<FindAllResponse<User>> {
    return await this.userRepository.findAll(filter, '-password', {
      limit,
      skip,
      sort,
      // populate: ['vendor', 'category', 'country'],
    });
  }
}
