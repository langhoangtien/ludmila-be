import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from '../../base/repositories/base.repository.abstract';
import { Comment, CommentDocument } from '../entities/comment.entity';
import { CommentsRepositoryInterface } from '../interfaces/comment.interface';

@Injectable()
export class CommentsRepository
  extends BaseRepositoryAbstract<CommentDocument>
  implements CommentsRepositoryInterface
{
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {
    super(commentModel);
  }
}
