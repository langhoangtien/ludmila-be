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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { BaseQueryDto } from '../base/dto/base.dto';
import { NullableType } from '../utils/types/nullable.type';
import { Public } from '../auth/decorators/auth.decorator';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { ROLE } from '../users/entities/user.entity';

@ApiTags('Categories')
@Controller({ path: 'categories', version: '1' })
@Roles(ROLE.ADMIN)
@UseGuards(JwtAccessTokenGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Public()
  findAll(@Query() query: BaseQueryDto<Category>) {
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

    return this.categoriesService.findAllWithPagination({
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
  findOne(@Param('id') id: string): Promise<NullableType<Category>> {
    return this.categoriesService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<NullableType<Category>> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  @Delete('delete/:id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}
