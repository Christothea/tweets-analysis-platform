import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '../env_config/config.module';
import { ApiClientService } from './base/api.client';
import { TweetsByUserCollector } from './services/tweets.byuser.collector';
import { TweetsSearchCollector } from './services/tweets.search.collector';

@Module({
  imports: [ConfigModule, CqrsModule],
  controllers: [],
  providers: [ApiClientService, TweetsByUserCollector, TweetsSearchCollector],
})
export class CollectorModule implements OnModuleInit {

  constructor(private readonly service: ApiClientService) {
  }

  onModuleInit() {
    this.service.start();
  }
}