import {
  Controller,
  Get,
  Param,
  Post,
  Response,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';

import { FilesService } from './files.service';

@ApiTags('Files')
@Controller({
  path: 'files',
  version: '1',
})
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
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
  @UseInterceptors(FilesInterceptor('files'))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.filesService.uploadFiles(files);
  }

  @Get(':path')
  @ApiParam({
    name: 'path',
    type: 'string',
  })
  download(@Param('path') path, @Response() response) {
    return response.sendFile(path, { root: './files' });
  }
}
