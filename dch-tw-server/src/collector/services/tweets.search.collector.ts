import { Injectable } from '@nestjs/common';
import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DataType } from '../../cache/models/data.type';
import { TweetDataDb } from '../../cache/models/tweet.data';
import { ConfigService } from '../../env_config/config.service';
import { CollectTweetsEvent } from '../../events/collect.tweets.event';
import { CollectedTweetEvent } from '../../events/collected.tweet.event';
import { ApiClientService } from '../base/api.client';
import { ApiEndpoint } from '../base/api.endpoint';
import { ApiTweetsRequestParams } from '../base/api.tweets.req.params';

@Injectable()
@EventsHandler(CollectTweetsEvent)
export class TweetsSearchCollector implements IEventHandler<CollectTweetsEvent> {

    constructor(private readonly twApiClient: ApiClientService,
        private readonly envConfig: ConfigService,
        private readonly eventBus: EventBus) {
    }

    handle(event: CollectTweetsEvent) {
        this.processSearchEvent(event);
    }

    private async processSearchEvent(event: CollectTweetsEvent) {
        if (!event.params.keyword
            || event.params.keyword.trim().length <= 1) {
            return;
        }

        const endpoint = ApiEndpoint.TWITTER_TWEETS_SEARCH;

        console.log(`Start Tweets Search on ${endpoint} for ${event.params.keyword}`);

        const params: ApiTweetsRequestParams = {
            q: event.params.keyword.replace('@', '').replace('#', ''),
            count: this.envConfig.TWAPI_MAX_RECORDS_NUM_PER_REQUEST,
            lang: 'en',
        };

        await this.fetchData(params, 0, endpoint);
    }

    private async fetchData(params: ApiTweetsRequestParams, loadedRecordsCount: number, endpoint) {
        const data = await this.twApiClient.fetchRequest(endpoint, params);

        if (data
            && data.statuses
            && Array.isArray(data.statuses)
            && data.statuses.length > 0) {

            let minTweetId: any = data.statuses[0].id;

            for (const tweet of data.statuses) {
                const tweetData: TweetDataDb = {
                    createdAt: new Date(),
                    type: DataType.TweetsData,
                    payload: tweet,
                };
                this.eventBus.publish(new CollectedTweetEvent(tweetData));

                if (tweet.id < minTweetId) {
                    minTweetId = tweet.id;
                }
            }

            if (data.statuses.length >= this.envConfig.TWAPI_MAX_RECORDS_NUM_PER_REQUEST
                && loadedRecordsCount < this.envConfig.MAX_TWEETS_PER_REQUEST) {
                // Load next batch of tweets
                const nextparams: ApiTweetsRequestParams = {
                    q: params.q,
                    count: this.envConfig.TWAPI_MAX_RECORDS_NUM_PER_REQUEST,
                    max_id: minTweetId + 1,
                    lang: this.envConfig.TWEETS_LANG,
                };

                await this.fetchData(nextparams, (loadedRecordsCount + this.envConfig.TWAPI_MAX_RECORDS_NUM_PER_REQUEST), endpoint);
            } else {
                console.log(`Ended Tweets Search on ${endpoint} for ${params.q}`);
            }
        }
    }
}
