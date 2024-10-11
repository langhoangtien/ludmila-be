import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { BaseQuery } from '../base/dto/base.dto';
import { Page } from './entities/page.entity';

@Controller({ path: 'pages', version: '1' })
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  create(@Body() createPageDto: CreatePageDto) {
    console.log('createPageDto', createPageDto);

    return this.pagesService.create(createPageDto);
  }

  @Get()
  @HttpCode(200)
  findAll(@Query() query: BaseQuery<Page>) {
    console.log('query', query);

    return this.pagesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.update(id, updatePageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagesService.remove(id);
  }
}
