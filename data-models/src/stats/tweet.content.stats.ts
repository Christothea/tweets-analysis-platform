import { SummaryStatRecord } from './summary.stat.record';

export class TweetContentStats {
    public wordsCounts: { [key: string]: SummaryStatRecord };
    public hashtagsCount: { [key: string]: SummaryStatRecord };
    public mentionedCount: { [key: string]: SummaryStatRecord };

    constructor() {
        this.wordsCounts = {};
        this.hashtagsCount = {};
        this.mentionedCount = {};
    }
}