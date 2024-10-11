import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Page, PageSchema } from './entities/page.entity';

@Module({
  controllers: [PagesController],
  providers: [PagesService],
  imports: [
    MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
  ],
})
export class PagesModule {}
