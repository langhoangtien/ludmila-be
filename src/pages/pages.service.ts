import { Injectable } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Page } from './entities/page.entity';
import { Model } from 'mongoose';
import { FindAllResponse } from '../utils/types/find-all-reponse.type';

@Injectable()
export class PagesService {
  constructor(@InjectModel(Page.name) private pageModel: Model<Page>) {}

  async create(createPageDto: CreatePageDto): Promise<Page> {
    const createdPage = new this.pageModel(createPageDto);
    return createdPage.save();
  }

  async findAll({
    skip = 0,
    limit = 10,
    order = 1,
    orderBy = 'createdAt',
  }: any): Promise<FindAllResponse<Page>> {
    const count = await this.pageModel.countDocuments();
    const items = await this.pageModel
      .find({ deletedAt: null })
      .skip(skip)
      .limit(limit)
      .sort({ [orderBy]: order })
      .exec();
    return { count, items };
  }

  findOne(id: string) {
    return this.pageModel.findOne({
      $or: [
        { _id: id, deletedAt: null },
        { slug: id, deletedAt: null },
      ],
    });
  }

  async update(id: string, updatePageDto: UpdatePageDto) {
    await this.pageModel.updateOne(
      { _id: id, deletedAt: null },
      updatePageDto,
      { new: true },
    );
    return this.pageModel.findById(id).exec();
  }

  remove(id: string) {
    return this.pageModel.updateOne(
      { _id: id },
      { deletedAt: new Date() },
      { new: true },
    );
  }
}
