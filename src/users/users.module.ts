import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users.controller'; // Import UsersController
import { UsersService } from './users.service'; // Import UsersService
import { UserSchemaFactory } from './entities/user.entity'; // Import UserSchemaFactory
import { UsersRepository } from './repositories/user.repository'; // Import UsersRepository

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: 'User', useFactory: UserSchemaFactory }, // Updated schema factory for User
    ]),
  ],
  controllers: [UsersController], // Updated controller
  providers: [
    UsersService, // Updated service
    {
      provide: 'UsersRepositoryInterface',
      useClass: UsersRepository, // Updated repository
    },
    // Add IsUnique to the providers array if needed
  ],
  exports: [UsersService, UsersModule], // Export UsersService and UsersModule if needed
})
export class UsersModule {} // Updated module name
