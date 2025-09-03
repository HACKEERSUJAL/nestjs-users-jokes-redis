import { Module } from '@nestjs/common';
import { JokesController } from './jokes.controller';
import { JokesService } from './jokes.service';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  imports: [
    RedisModule
  ],
  controllers: [JokesController],
  providers: [JokesService]
})
export class JokesModule { }
