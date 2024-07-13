import {
  HttpStatus,
  Module,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FilesService } from './files.service';

import { MongooseModule } from '@nestjs/mongoose';
import { FileUpload, FileUploadSchema } from './entities/file.entity';
import { FilesController } from './files.controller';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
// import {  memoryStorage } from 'multer';
import { AllConfigType } from '../config/config.type';

const FilesLocalModule = MulterModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService<AllConfigType>) => {
    return {
      fileFilter: (request, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return callback(
            new UnprocessableEntityException({
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              errors: {
                file: `cantUploadFileType`,
              },
            }),
            false,
          );
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination: './files/originals/',
        filename: (request, file, callback) => {
          callback(
            null,
            `${randomStringGenerator()}.${file.originalname
              .split('.')
              .pop()
              ?.toLowerCase()}`,
          );
        },
      }),
      // storage: memoryStorage(),
      limits: {
        fileSize: configService.get('file.maxFileSize', { infer: true }),
      },
    };
  },
});

const UploaderModule = FilesLocalModule;

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FileUpload.name, schema: FileUploadSchema },
    ]),
    UploaderModule,
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
