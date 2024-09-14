import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { NullableType } from '../utils/types/nullable.type';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';

import mongoose from 'mongoose';
import { CommentQueryDto } from './dto/comments.query.dto';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { ROLE } from '../users/entities/user.entity';

@ApiTags('Comments')
@Controller({ path: 'comments', version: '1' })
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(OptionalAuthGuard)
  create(
    @Request() request,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<NullableType<Comment>> {
    let payload: Partial<CreateCommentDto & { userId: string }> = {};
    if (request?.user && request.user) {
      payload = {
        productId: createCommentDto.productId,
        userId: request.user.id,
        content: createCommentDto.content,
        rating: createCommentDto.rating,
        parentId: createCommentDto.parentId,
      };
    } else {
      payload = {
        fullName: createCommentDto.fullName,
        productId: createCommentDto.productId,
        phoneNumber: createCommentDto.phoneNumber,
        content: createCommentDto.content,
        rating: createCommentDto.rating,
        parentId: createCommentDto.parentId,
      };
    }

    return this.commentsService.createComment(payload);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: CommentQueryDto) {
    const skip = query?.skip ?? 0;
    let limit = query?.limit ?? 5;
    if (limit > 100) {
      limit = 100;
    }
    const filter = query?.filter ?? {};
    const productId = query?.productId;
    const parentId = query?.parentId;
    const filterObject = {
      productId: new mongoose.Types.ObjectId(productId),
      parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
      ...filter,
    };

    const sort = {
      createdAt: -1,
    };
    return this.commentsService.aggregate({
      skip,
      limit,
      filter: filterObject,
      sort,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: string): Promise<NullableType<Comment>> {
    return this.commentsService.findById(id);
  }

  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Request() request,
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<NullableType<Comment>> {
    const userId = request.user.id;
    return this.commentsService.updateComment(id, userId, updateCommentDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }

  @Delete('delete/:id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  delete(@Param('id') id: string) {
    return this.commentsService.delete(id);
  }
}
