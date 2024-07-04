import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllResponse } from '../utils/types/find-all-reponse.type';
import { ROLE, User } from './entities/user.entity';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { BaseQueryDto } from '../base/dto/base.dto';
import { NullableType } from '../utils/types/nullable.type';
import { Roles } from '../roles/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
// import MongooseClassSerializerInterceptor from '../interceptors/mongoose-class-serializer.interceptor';

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
// @UseInterceptors(MongooseClassSerializerInterceptor(User))
@Roles(ROLE.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: BaseQueryDto<User>): Promise<FindAllResponse<User>> {
    const skip = query?.skip ?? 0;
    let limit = query?.limit ?? 10;
    if (limit > 100) {
      limit = 100;
    }
    const filter = query?.filter ?? {};
    const sortQuery = query?.sort ?? { orderBy: 'createdAt', order: 'asc' };

    const sort = {
      [sortQuery.orderBy]: sortQuery.order,
    };
    return this.usersService.findAllWithPagination({
      skip,
      limit,
      filter,
      sort,
    });
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: string): Promise<NullableType<User>> {
    return this.usersService.findById(id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<NullableType<User>> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id); // Updated method call to use UsersService
  }

  @Delete('delete/:id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.usersService.delete(id); // Updated method call to use UsersService
  }
}
