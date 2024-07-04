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
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto'; // Tạo một DTO 'UpdateCountryDto' tương tự như 'UpdateCategoryDto'
import { FindAllResponse } from '../utils/types/find-all-reponse.type';
import { Country } from './entities/country.entity'; // Sửa từ 'Category' thành 'Country'
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { BaseQueryDto } from '../base/dto/base.dto';
import { NullableType } from '../utils/types/nullable.type';
import { Public } from '../auth/decorators/auth.decorator';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { ROLE } from '../users/entities/user.entity';

@ApiTags('Countries')
@Controller({ path: 'countries', version: '1' })
@Roles(ROLE.ADMIN)
@UseGuards(JwtAccessTokenGuard, RolesGuard)
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCountryDto: CreateCountryDto): Promise<Country> {
    return this.countriesService.create(createCountryDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Public()
  findAll(
    @Query() query: BaseQueryDto<Country>,
  ): Promise<FindAllResponse<Country>> {
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
    return this.countriesService.findAllWithPagination({
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
  findOne(@Param('id') id: string): Promise<NullableType<Country>> {
    return this.countriesService.findById(id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ): Promise<NullableType<Country>> {
    return this.countriesService.update(id, updateCountryDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.countriesService.remove(id);
  }

  @Delete('delete/:id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.countriesService.delete(id);
  }
}
