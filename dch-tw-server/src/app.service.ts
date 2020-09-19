import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { QueryRequest, SummaryStatistics } from '@dch/data-models';
import { CollectTweetsEvent } from './events/collect.tweets.event';
import { CacheService } from './cache/service';
import { SummaryStatisticsDb } from './cache/models/summary.stats';

@Injectable()
export class AppService {

  constructor(private readonly eventBus: EventBus,
    private readonly cacheService: CacheService) {

  }

  collectTweets(query: QueryRequest) {
    for (const keyword of query.keyWords) {
      this.eventBus.publish(new CollectTweetsEvent({ keyword }));
    }
  }

  async statisticsRequest(): Promise<SummaryStatistics> {
    const dbstats: SummaryStatisticsDb = await this.cacheService.getSummaryStats();

    let stats: SummaryStatistics = new SummaryStatistics();

    if (dbstats) {
      stats = {
        wordsCounts: dbstats.wordsCounts,
        hashtagsCount: dbstats.hashtagsCount,
        mentionedCount: dbstats.mentionedCount,
        totalTweets: dbstats.totalTweets,
        usersTweetsCount: dbstats.usersTweetsCount,
        favoritedTweets: dbstats.favoritedTweets,
        retweetedTweets: dbstats.retweetedTweets,
      };
    } else {
      stats = new SummaryStatistics();
    }

    return stats;
  }
}
