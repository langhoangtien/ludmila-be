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
  UseGuards,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto'; // Thay thế CreateCategoryDto thành CreateBrandDto ở đây
import { UpdateBrandDto } from './dto/update-brand.dto'; // Thay thế UpdateCategoryDto thành UpdateBrandDto ở đây
import { Brand } from './entities/brand.entity'; // Thay thế Category thành Brand ở đây
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { BaseQueryDto } from '../base/dto/base.dto';
import { NullableType } from '../utils/types/nullable.type';
import { Public } from '../auth/decorators/auth.decorator';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { ROLE } from '../users/entities/user.entity';

@ApiTags('Brands')
@Controller({ path: 'brands', version: '1' })
@Roles(ROLE.ADMIN)
@UseGuards(JwtAccessTokenGuard, RolesGuard)
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Public()
  findAll(@Query() query: BaseQueryDto<Brand>) {
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
    return this.brandsService.findAllWithPagination({
      skip,
      limit,
      filter,
      sort,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @Public()
  findOne(@Param('id') id: string): Promise<NullableType<Brand>> {
    // Thay thế Category thành Brand ở đây
    return this.brandsService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto, // Thay thế UpdateCategoryDto thành UpdateBrandDto ở đây
  ): Promise<NullableType<Brand>> {
    return this.brandsService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }

  @Delete('delete/:id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.brandsService.delete(id);
  }
}
