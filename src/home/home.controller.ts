import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HomeService } from './home.service';

@ApiTags('Home')
@Controller({ path: 'home', version: '1' })
export class HomeController {
  constructor(private service: HomeService) {}

  @Get()
  async getHomeData() {
    return this.service.getHomeData();
  }
  @Get('select-info')
  async getProductReferenceData() {
    return this.service.getProductReferenceData();
  }
}
