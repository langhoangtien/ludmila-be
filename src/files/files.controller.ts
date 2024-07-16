import {
  Controller,
  Get,
  Param,
  Post,
  Response,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';

import { DIMENSION_FOLDER, FilesService } from './files.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Files')
@Controller({
  path: 'files',
  version: '1',
})
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  // @UseInterceptors(MongooseClassSerializerInterceptor(FileUpload))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.create(file);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Post('upload-multiple')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('files'))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.filesService.uploadFiles(files);
  }

  @Get(':path')
  @ApiParam({
    name: 'path',
    type: 'string',
  })
  download(@Param('path') filename, @Response() response) {
    console.log('filename', filename);

    return response.sendFile(filename, { root: './files' });
  }
  @Get(':dimension/:path')
  @ApiParam({
    name: 'path',
    type: 'string',
  })
  downloadWithDimension(
    @Param('dimension') dimension: DIMENSION_FOLDER,
    @Param('path') filename,

    @Response() response,
  ) {
    return response.sendFile(filename, { root: './files/' + dimension });
  }
}
