// common/decorators/is-unique.decorator.ts

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@ValidatorConstraint({ name: 'isUnique', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly model: Model<any>) {}

  async validate(value: any) {
    const existingRecord = await this.model.findOne(value);
    return !existingRecord;
  }

  defaultMessage() {
    return '$property must be unique';
  }
}

export function IsUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueConstraint,
    });
  };
}
