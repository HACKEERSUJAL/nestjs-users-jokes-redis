import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { RedisService } from 'src/common/redis/redis.service';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  controllers: [UserController],
  providers: [UsersService],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), RedisModule],
})
export class UserModule { }
