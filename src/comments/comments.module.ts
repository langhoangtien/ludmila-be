import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentSchemaFactory } from './entities/comment.entity';
import { CommentsRepository } from './repositories/comment.repository';
import { UsersModule } from '../users/users.module';

import { ProductsModule } from '../products/products.module';
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: 'Comment', useFactory: CommentSchemaFactory },
    ]),
    UsersModule,
    ProductsModule,
  ],

  controllers: [CommentsController],
  providers: [
    CommentsService,
    {
      provide: 'CommentsRepositoryInterface',
      useClass: CommentsRepository,
    },
  ],
  exports: [CommentsService, CommentsModule],
})
export class CommentsModule {}
