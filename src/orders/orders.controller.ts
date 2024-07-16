import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  HttpCode,
  HttpStatus,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

import { ApiParam, ApiTags } from '@nestjs/swagger';
import { BaseQueryDto } from '../base/dto/base.dto';
import { NullableType } from '../utils/types/nullable.type';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { ROLE } from '../users/entities/user.entity';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';

import { AuthGuard } from '@nestjs/passport';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';

@ApiTags('Orders')
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(OptionalAuthGuard)
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Request() request,
  ): Promise<Order> {
    return this.ordersService.createOrder(createOrderDto, request.user);
  }

  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: BaseQueryDto<Order>) {
    const skip = query?.skip ?? 0;
    let limit = query?.limit ?? 10;
    if (limit > 100) {
      limit = 100;
    }
    const filter = query?.filter ?? {};
    const sortQuery = query?.sort ?? { orderBy: 'createdAt', order: 1 };

    const sort = {
      [sortQuery.orderBy]: sortQuery.order,
    };
    return this.ordersService.findAllWithPagination({
      skip,
      limit,
      filter,
      sort,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Get('me')
  me(@Request() request, @Query() query: BaseQueryDto<Order>) {
    const skip = query?.skip ?? 0;
    let limit = query?.limit ?? 10;
    if (limit > 100) {
      limit = 100;
    }
    const filter = { userId: request.user.id };
    const sortQuery = query?.sort ?? { orderBy: 'createdAt', order: 1 };

    const sort = {
      [sortQuery.orderBy]: sortQuery.order,
    };
    return this.ordersService.findMyOrders({
      skip,
      limit,
      filter,
      sort,
    });
  }

  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
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
  findOne(@Param('id') id: string): Promise<NullableType<Order>> {
    return this.ordersService.findById(id);
  }

  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<NullableType<Order>> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Delete('delete/:id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.ordersService.delete(id);
  }
}
