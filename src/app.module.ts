import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JokesModule } from './jokes/jokes.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from './common/redis/redis.module';

@Module({
  imports: [JokesModule, UserModule, RedisModule, MongooseModule.forRoot('// put here your mongo url')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
