import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ name: 'SalePrice', async: false })
export class SalePrice implements ValidatorConstraintInterface {
  constructor() {}

  validate(value: number, args: any) {
    return args.object.price >= value;
  }
  defaultMessage() {
    return 'salePrice must be less than or equal to price';
  }
}
