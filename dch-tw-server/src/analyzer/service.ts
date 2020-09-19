import { TweetContentStats } from '@dch/data-models';
import { Injectable } from '@nestjs/common';
import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import * as nlp from 'natural';
import { StoreDataEvent } from 'src/events/store.data.event';
import * as sw from 'stopword';
import { SummaryStatisticsDb } from '../cache/models/summary.stats';
import { TweetDataDb } from '../cache/models/tweet.data';
import { CacheService } from '../cache/service';
import { CollectedTweetEvent } from '../events/collected.tweet.event';

@Injectable()
@EventsHandler(CollectedTweetEvent)
export class AnalyzerService implements IEventHandler<CollectedTweetEvent> {
    pendingEvents: CollectedTweetEvent[] = [];

    constructor(private readonly eventBus: EventBus,
        private readonly cacheService: CacheService) {
        this.worker();
    }

    handle(event: CollectedTweetEvent) {
        this.pendingEvents.push(event);
    }

    /*
    * Reason for this, is that we should process tweets one by one, to avoid raise conditions on Summary Statistics calculation
    * NOTE: this implementation is not recommended, should be revisited
    */
    private async worker() {
        while (true) {
            const event: CollectedTweetEvent = this.pendingEvents.pop();
            if (event) { this.processCollectedTweetEvent(event); }

            await new Promise(r => setTimeout(r, 10));
        }
    }

    private async processCollectedTweetEvent(event: CollectedTweetEvent) {
        if (!event.tweetData.payload) {
            return;
        }

        // 1. Check if tweet already exists
        const existingTweet: TweetDataDb = await this.cacheService.getTweetData(event.tweetData.payload.id);

        if (existingTweet) {
            return;
        }

        // 2. If not exists proceed with statistics and storage

        const tweetData: TweetDataDb = this.patchTweetStatistics(event.tweetData);
        const statsData: SummaryStatisticsDb = await this.updateSummaryStatistics(tweetData);

        this.eventBus.publish(new StoreDataEvent(statsData));
        this.eventBus.publish(new StoreDataEvent(tweetData));
    }

    private patchTweetStatistics(newTweetData: TweetDataDb): TweetDataDb {
        if (!newTweetData.payload.text) {
            return newTweetData;
        }

        newTweetData.stats = new TweetContentStats();

        try {
            // A. Words count
            let text: string = newTweetData.payload.text;

            // 1. Removing links, special characters
            text = text.replace(/(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)/g, '');

            if (text.length >= 3
                && !parseInt(text)) {
                // 2. Tokenize
                const tokenizer = new nlp.WordTokenizer();
                let words: string[] = tokenizer.tokenize(text);

                // 3. Remove stop words
                words = sw.removeStopwords(words);

                // 4. Count the words
                if (words && words.length > 0) {
                    for (let word of words) {
                        if (word.length <= 3) {
                            continue;
                        }

                        word = nlp.PorterStemmer.stem(word.toLocaleLowerCase());

                        if (!(word in newTweetData.stats.wordsCounts)) {
                            newTweetData.stats.wordsCounts[word] = { label: word, count: 1 };
                        } else {
                            newTweetData.stats.wordsCounts[word].count += 1;
                        }
                    }
                }
            }

            // B. Hashtags count
            if (newTweetData.payload.entities
                && newTweetData.payload.entities.hashtags) {
                for (const hashtag of newTweetData.payload.entities.hashtags) {
                    if (!(hashtag.text in newTweetData.stats.hashtagsCount)) {
                        newTweetData.stats.hashtagsCount[hashtag.text] = { label: hashtag.text, count: 1 };
                    } else {
                        newTweetData.stats.hashtagsCount[hashtag.text].count += 1;
                    }
                }
            }

            // C. Mentions count
            if (newTweetData.payload.entities
                && newTweetData.payload.entities.user_mentions) {
                for (const mention of newTweetData.payload.entities.user_mentions) {
                    if (!(mention.screen_name in newTweetData.stats.mentionedCount)) {
                        newTweetData.stats.mentionedCount[mention.screen_name] = { label: mention.screen_name, count: 1 };
                    } else {
                        newTweetData.stats.mentionedCount[mention.screen_name].count += 1;
                    }
                }
            }

        } catch (ex) {
            console.error('Prepare Tweet Statistics Exception');
            console.error(ex);
        }

        return newTweetData;
    }

    private async updateSummaryStatistics(tweetData: TweetDataDb) {

        // 1. Load Last statistics from cache
        let statsData: SummaryStatisticsDb = await this.cacheService.getSummaryStats();

        if (!statsData) {
            statsData = new SummaryStatisticsDb();
        }

        if (!tweetData.payload) {
            return statsData;
        }

        // 2. Update summary
        statsData.totalTweets += 1;

        if (tweetData.stats) {
            // A. Words count
            if (tweetData.stats.wordsCounts) {
                for (const word of Object.keys(tweetData.stats.wordsCounts)) {
                    if (!(word in statsData.wordsCounts)) {
                        statsData.wordsCounts[word] = { label: word, count: tweetData.stats.wordsCounts[word].count };
                    } else {
                        statsData.wordsCounts[word].count += tweetData.stats.wordsCounts[word].count;
                    }
                }
            }

            // B. Hashtags
            if (tweetData.stats.hashtagsCount) {
                for (const hashtag of Object.keys(tweetData.stats.hashtagsCount)) {
                    if (!(hashtag in statsData.hashtagsCount)) {
                        statsData.hashtagsCount[hashtag] = { label: hashtag, count: tweetData.stats.hashtagsCount[hashtag].count };
                    } else {
                        statsData.hashtagsCount[hashtag].count += tweetData.stats.hashtagsCount[hashtag].count;
                    }
                }
            }

            // C. User Mentions
            if (tweetData.stats.mentionedCount) {
                for (const mention of Object.keys(tweetData.stats.mentionedCount)) {
                    if (!(mention in statsData.mentionedCount)) {
                        statsData.mentionedCount[mention] = { label: mention, count: tweetData.stats.mentionedCount[mention].count };
                    } else {
                        statsData.mentionedCount[mention].count += tweetData.stats.mentionedCount[mention].count;
                    }
                }
            }
        }

        // D. Users TweetsCount
        if (!(tweetData.payload.user.screen_name in statsData.usersTweetsCount)) {
            statsData.usersTweetsCount[tweetData.payload.user.screen_name] = { label: tweetData.payload.user.screen_name, count: 1 };
        } else {
            statsData.usersTweetsCount[tweetData.payload.user.screen_name].count += 1;
        }

        // E. Most Favorited Tweets
        // count only native tweets, not re-tweets
        if (!tweetData.payload.retweeted_status
            && tweetData.payload.favorite_count > 0) {
            if (!(tweetData.payload.id in statsData.favoritedTweets)) {
                statsData.favoritedTweets[tweetData.payload.id] = tweetData.payload.favorite_count;
            } else {
                statsData.favoritedTweets[tweetData.payload.id] += tweetData.payload.favorite_count;
            }
        }

        // F. Most Retweeted Tweets
        // count only native tweets, not re-tweets
        if (!tweetData.payload.retweeted_status
            && tweetData.payload.retweet_count > 0) {
            if (!(tweetData.payload.id in statsData.retweetedTweets)) {
                statsData.retweetedTweets[tweetData.payload.id] = tweetData.payload.retweet_count;
            } else {
                statsData.retweetedTweets[tweetData.payload.id] += tweetData.payload.retweet_count;
            }
        }

        return statsData;
    }

}
