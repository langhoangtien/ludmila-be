import {
  HttpException,
  HttpStatus,
  Injectable,
  // PayloadTooLargeException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as util from 'util'; // Import util for promisify

const fsMkdir = util.promisify(fs.mkdir); // Promisify fs.mkdir to use async/await

// import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
// import { ConfigService } from '@nestjs/config';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FileUpload } from './entities/file.entity';
// import { AllConfigType } from '../config/config.type';

// import { FileType } from './domain/file';
import sharp from 'sharp';

export enum DIMENSION {
  D250 = 250,
  D450 = 450,
  D800 = 800,
}
export enum DIMENSION_FOLDER {
  D250 = '250x250',
  D450 = '450x450',
  D800 = '800x800',
  ORIGIN = 'originals',
}
@Injectable()
export class FilesService {
  // private s3: S3Client;

  constructor(
    @InjectModel(FileUpload.name)
    private readonly fileRepository: Model<FileUpload>,
    // private readonly configService: ConfigService<AllConfigType>,
  ) {
    //   this.s3 = new S3Client({
    //     region: configService.get('file.awsS3Region', { infer: true }),
    //     credentials: {
    //       accessKeyId: configService.getOrThrow('file.accessKeyId', {
    //         infer: true,
    //       }),
    //       secretAccessKey: configService.getOrThrow('file.secretAccessKey', {
    //         infer: true,
    //       }),
    //     },
    //   });
    // }
    // async createS3Presigned(
    //   file: FileUploadDto,
    // ): Promise<{ file: FileType; uploadSignedUrl: string }> {
    //   if (!file) {
    //     throw new UnprocessableEntityException({
    //       status: HttpStatus.UNPROCESSABLE_ENTITY,
    //       errors: {
    //         file: 'selectFile',
    //       },
    //     });
    //   }
    //   if (!file.fileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
    //     throw new UnprocessableEntityException({
    //       status: HttpStatus.UNPROCESSABLE_ENTITY,
    //       errors: {
    //         file: `cantUploadFileType`,
    //       },
    //     });
    //   }
    //   if (
    //     file.fileSize >
    //     (this.configService.get('file.maxFileSize', {
    //       infer: true,
    //     }) || 0)
    //   ) {
    //     throw new PayloadTooLargeException({
    //       statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
    //       error: 'Payload Too Large',
    //       message: 'File too large',
    //     });
    //   }
    //   const key = `${randomStringGenerator()}.${file.fileName
    //     .split('.')
    //     .pop()
    //     ?.toLowerCase()}`;
    //   const command = new PutObjectCommand({
    //     Bucket: this.configService.getOrThrow('file.awsDefaultS3Bucket', {
    //       infer: true,
    //     }),
    //     Key: key,
    //     ContentLength: file.fileSize,
    //   });
    //   const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    //   const data = await this.fileRepository.create({
    //     path: key,
    //   });
    //   return {
    //     file: data,
    //     uploadSignedUrl: signedUrl,
    //   };
  }

  async createS3(file: Express.MulterS3.File): Promise<{ file: FileUpload }> {
    if (!file) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: 'selectFile',
        },
      });
    }

    return {
      file: await this.fileRepository.create({
        path: file.key,
      }),
    };
  }
  async resizeImage(file): Promise<void> {
    const metadata = await sharp(file.path).metadata();
    if (
      !metadata ||
      typeof metadata.width !== 'number' ||
      typeof metadata.height !== 'number'
    ) {
      return;
    }

    const metadataHeight = metadata.height;
    const metadataWidth = metadata.width;
    const dimensions: number[] = [250, 450, 800, 0];

    const resizeImages = dimensions.map(async (dimension) => {
      let width = metadataWidth;
      let height = metadataHeight;
      if (width < height) {
        width = dimension;
        height = Math.round((dimension * metadataHeight) / metadataWidth);
      } else {
        height = dimension;
        width = Math.round((dimension * metadataWidth) / metadataHeight);
      }

      let directoryPath = './files';
      if (dimension) directoryPath = `./files/${dimension}x${dimension}`;

      try {
        // Check if directory exists, create it if not
        await fsMkdir(directoryPath, { recursive: true });

        if (dimension)
          await sharp(file.path)
            .webp()
            .resize(width, height)
            .toFile(`${directoryPath}/${file.filename.split('.')[0]}.webp`);
        else
          await sharp(file.path)
            .webp()
            .toFile(`${directoryPath}/${file.filename.split('.')[0]}.webp`);
      } catch (err) {
        console.error(
          `Error resizing and saving image for dimension ${dimension}:`,
          err,
        );
        // Handle error, throw or log as needed
      }
    });

    await Promise.all(resizeImages);
  }

  async create(file: Express.Multer.File): Promise<FileUpload> {
    try {
      if (!file) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'selectFile',
          },
        });
      }
      console.log('file', file);

      await this.resizeImage(file);
      // PHAI THAY
      return await this.fileRepository.create({
        originPath: `${file.filename}`,
        path: `${file.filename.split('.')[0]}.webp`,
      });
    } catch (error) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: 'selectFile',
        },
      });
    }
  }

  async uploadFiles(files: Array<Express.Multer.File>): Promise<FileUpload[]> {
    if (!files.length) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            files: 'selectFile',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const paths = files.map((file) => ({
      path: file.filename,
    }));

    return Promise.all(paths.map((e) => this.getListFile(e)));
  }

  async getListFile(item) {
    return await this.fileRepository.create(item);
  }
}
