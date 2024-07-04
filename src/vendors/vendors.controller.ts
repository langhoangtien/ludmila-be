import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  // UseInterceptors,
  HttpCode,
  HttpStatus,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto'; // Thay đổi từ 'CreateCategoryDto' thành 'CreateVendorDto'
import { UpdateVendorDto } from './dto/update-vendor.dto'; // Thay đổi từ 'UpdateCategoryDto' thành 'UpdateVendorDto'
import { FindAllResponse } from '../utils/types/find-all-reponse.type';
import { Vendor } from './entities/vendor.entity'; // Thay đổi từ 'Category' thành 'Vendor'

import { ApiParam, ApiTags } from '@nestjs/swagger';
import { BaseQueryDto } from '../base/dto/base.dto';
import { NullableType } from '../utils/types/nullable.type';
import { Public } from '../auth/decorators/auth.decorator';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { ROLE } from '../users/entities/user.entity';

@ApiTags('Vendors') // Thay đổi từ 'Categories' thành 'Vendors'
@Controller({ path: 'vendors', version: '1' }) // Thay đổi từ 'categories' thành 'vendors'
@Roles(ROLE.ADMIN)
@UseGuards(JwtAccessTokenGuard, RolesGuard)
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVendorDto: CreateVendorDto): Promise<Vendor> {
    // Thay đổi từ 'CreateCategoryDto' thành 'CreateVendorDto'
    return this.vendorsService.create(createVendorDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Public()
  findAll(
    @Query() query: BaseQueryDto<Vendor>, // Thay đổi từ 'Category' thành 'Vendor'
  ): Promise<FindAllResponse<Vendor>> {
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
    return this.vendorsService.findAllWithPagination({
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
  @Public()
  findOne(@Param('id') id: string): Promise<NullableType<Vendor>> {
    // Thay đổi từ 'Category' thành 'Vendor'
    return this.vendorsService.findById(id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateVendorDto: UpdateVendorDto, // Thay đổi từ 'UpdateCategoryDto' thành 'UpdateVendorDto'
  ): Promise<NullableType<Vendor>> {
    return this.vendorsService.update(id, updateVendorDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.vendorsService.remove(id);
  }

  @Delete('delete/:id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.vendorsService.delete(id);
  }
}
