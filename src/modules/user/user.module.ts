import { User, userSchema } from '../user/schemas/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import 'dotenv/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
  ],
  providers: [
    UserService,
    UserRepository,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
