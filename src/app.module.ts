import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { POST_QUEUE, REDIS_HOST, REDIS_PORT } from './constants';
import { PostConsumer } from './post.consumer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get(REDIS_HOST),
          port: configService.get(REDIS_PORT),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({ name: POST_QUEUE }),
  ],
  controllers: [AppController],
  providers: [AppService, PostConsumer],
})
export class AppModule {}
