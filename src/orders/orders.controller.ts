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
import { Public } from '../auth/decorators/auth.decorator';

@ApiTags('Orders')
@Controller({ path: 'orders', version: '1' })
@Roles(ROLE.ADMIN)
@UseGuards(JwtAccessTokenGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Public()
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

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
