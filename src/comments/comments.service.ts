import {
  HttpStatus,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { BaseServiceAbstract } from '../base/services/base.service.abstract';
import { CommentsRepositoryInterface } from './interfaces/comment.interface';
import { NullableType } from '../utils/types/nullable.type';
import { UsersService } from '../users/users.service';

import { ProductsService } from '../products/products.service';

@Injectable()
export class CommentsService extends BaseServiceAbstract<Comment> {
  constructor(
    @Inject('CommentsRepositoryInterface')
    private readonly commentRepository: CommentsRepositoryInterface,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {
    super(commentRepository);
  }

  async createComment(
    createDto: Partial<Comment> | any,
  ): Promise<NullableType<Comment>> {
    try {
      const newComment = await this.commentRepository.create(createDto);
      await this.productsService.updateRating(
        createDto.productId,
        createDto.rating,
      );
      return newComment;
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          comment: 'createCommentError',
        },
      });
    }
  }
  async updateComment(
    id: string,
    userId,
    updateDto: Partial<Comment> | any,
  ): Promise<NullableType<Comment>> {
    const currentUser = await this.usersService.findById(userId);

    if (!currentUser) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'userNotFound',
        },
      });
    }
    return await this.commentRepository.update(id, updateDto);
  }

  async aggregate({
    limit,
    skip,
    filter,
    sort,
  }: {
    limit: number;
    skip: number;
    filter: any;
    sort: any;
  }) {
    const totalCount = await this.commentRepository.aggregate([
      {
        $match: {
          ...filter,
          deletedAt: null,
        },
      },
      {
        $count: 'total',
      },
    ]);

    const items = await this.commentRepository.aggregate([
      {
        $match: {
          ...filter,
          deletedAt: null,
        },
      },

      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: { path: '$user', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          phoneNumber: 1,
          fullName: 1,
          rating: 1,
          productId: 1,
          createdAt: 1,
          'user.firstName': 1,
          'user.lastName': 1,
        },
      },
      {
        $sort: sort,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    return { count: totalCount[0] ? totalCount[0].total : 0, items };
  }
}
