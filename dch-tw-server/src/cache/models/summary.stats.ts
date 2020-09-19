import { SummaryStatistics } from '@dch/data-models';
import { IDataStoreEntity } from '../models/data.store.entity';
import { DataType } from './data.type';

export class SummaryStatisticsDb extends SummaryStatistics implements IDataStoreEntity {
    public _id?: any;
    public createdAt: Date;
    public type: DataType;

    constructor() {
        super();
        this.type = DataType.SummaryStatistics;
        this.wordsCounts = {};
        this.hashtagsCount = {};
        this.mentionedCount = {};
        this.usersTweetsCount = {};
        this.favoritedTweets = {};
        this.retweetedTweets = {};
    }
}
