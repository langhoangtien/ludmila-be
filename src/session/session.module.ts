// Session.module.ts (hoặc bất kỳ module nào cần sử dụng IsUnique)

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Đường dẫn đến IsUnique decorator

import { SessionService } from './session.service';
import { SessionSchemaFactory } from './entities/session.entity';
import { SessionsRepository } from './repositories/session.repository';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: 'Session', useFactory: SessionSchemaFactory },
    ]),
  ],

  providers: [
    SessionService,
    {
      provide: 'SessionsRepositoryInterface',
      useClass: SessionsRepository,
    },
  ],
  exports: [SessionService, SessionModule],
})
export class SessionModule {}
