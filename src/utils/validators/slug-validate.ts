import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ name: 'IsSlug', async: false })
export class IsSlug implements ValidatorConstraintInterface {
  constructor() {}

  validate(value: string) {
    const regex = new RegExp('^[a-z0-9]+(?:(?:-|_)+[a-z0-9]+)*$', 'gmi');
    return regex.test(value);
  }
  defaultMessage() {
    // here you can provide default error message if validation failed
    return 'Text must be a valid URL slug';
  }
}
