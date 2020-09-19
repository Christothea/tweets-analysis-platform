import { TweetContentStats } from './tweet.content.stats';
import { SummaryStatRecord } from './summary.stat.record';

export class SummaryStatistics extends TweetContentStats {
    public usersTweetsCount: { [key: string]: SummaryStatRecord };
    public favoritedTweets: { [key: string]: SummaryStatRecord };
    public retweetedTweets: { [key: string]: SummaryStatRecord };
    public totalTweets: number;

    constructor() {
        super();
        this.totalTweets = 0;
        this.wordsCounts = {};
        this.hashtagsCount = {};
        this.mentionedCount = {};
        this.usersTweetsCount = {};
        this.favoritedTweets = {};
        this.retweetedTweets = {};
    }
}
