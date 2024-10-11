import { Injectable } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { Option } from './entities/option.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OptionsService {
  constructor(@InjectModel(Option.name) private optionModel: Model<Option>) {}
  async create(createOptionDto: CreateOptionDto): Promise<Option> {
    const option = await this.optionModel.findOne();
    if (option) {
      return option;
    }
    const createdPage = new this.optionModel(createOptionDto);
    return createdPage.save();
  }

  findOne() {
    return this.optionModel.findOne();
  }

  update(id: number, updateOptionDto: UpdateOptionDto) {
    return `This action updates a #${id} option`;
  }
}
