import {
  ClassSerializerInterceptor,
  PlainLiteralObject,
  Type,
} from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { Document } from 'mongoose';

export default function MongooseClassSerializerInterceptor(
  classToIntercept: Type,
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    private changePlainObjectToClass(document: PlainLiteralObject) {
      console.log('INTERCPTOR MONGO TO CLASS', document);
      if (!(document instanceof Document)) {
        return document;
      }
      return plainToClass(classToIntercept, document.toJSON(), {
        excludePrefixes: ['_'],
      });
    }

    private prepareResponse(
      response:
        | PlainLiteralObject
        | PlainLiteralObject[]
        | { items: PlainLiteralObject[]; count: number },
    ) {
      if (!Array.isArray(response) && response?.items) {
        const items = this.prepareResponse(response.items);
        console.log('INTERCPTOR MONGO REPOSSN ', response);
        return {
          count: response.count,
          items,
        };
      }

      if (Array.isArray(response)) {
        console.log('INTERCPTOR MONGO X ', response);
        return response.map(this.changePlainObjectToClass);
      }

      return this.changePlainObjectToClass(response);
    }

    serialize(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassTransformOptions,
    ) {
      console.log('INTERCPTOR MONGO ');
      return super.serialize(this.prepareResponse(response), options);
    }
  };
}
