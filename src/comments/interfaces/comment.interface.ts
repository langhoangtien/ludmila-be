import { BaseRepositoryInterface } from '../../base/repositories/base.repository.interface';
import { Comment } from '../entities/comment.entity';

export interface CommentsRepositoryInterface
  extends BaseRepositoryInterface<Comment> {}
