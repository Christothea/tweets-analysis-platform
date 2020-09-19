import { TweetData } from '@dch/data-models';
import { IDataStoreEntity } from './data.store.entity';
import { DataType } from './data.type';

export class TweetDataDb extends TweetData implements IDataStoreEntity {
    public _id?: any;
    public createdAt: Date;
    public type: DataType;

    constructor() {
        super();
        this.type = DataType.TweetsData;
    }
}
