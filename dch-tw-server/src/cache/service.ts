import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ConfigService } from '../env_config/config.service';
import { StoreDataEvent } from '../events/store.data.event';
import { DataType } from './models/data.type';
import { SummaryStatisticsDb } from './models/summary.stats';
import { TweetDataDb } from './models/tweet.data';
import { DataStoreOptions } from './store/data.store.options';
import { MongoDataStore } from './store/mongo.data.store';

@Injectable()
@EventsHandler(StoreDataEvent)
export class CacheService implements IEventHandler<StoreDataEvent>{
    private dataStore: MongoDataStore<DataType>;
    constructor(private readonly envConfig: ConfigService) {
        this.init();
    }

    //#region Service Management
    private init() {
        const dataStoreOptions: DataStoreOptions = {
            host: this.envConfig.MONGO_DB_HOST,
            port: this.envConfig.MONGO_DB_PORT,
            database: this.envConfig.MONGO_DB_NAME,
        };

        this.dataStore = new MongoDataStore<DataType>(dataStoreOptions);
        this.dataStore.connect();
    }

    //#endregion

    //#region Public interface
    public async getSummaryStats(): Promise<SummaryStatisticsDb> {
        const records: SummaryStatisticsDb[] = await this.dataStore.read(DataType.SummaryStatistics);

        if (!records || records.length === 0) {
            return undefined;
        }

        return records[records.length - 1];
    }

    public async saveSummaryStats(data: SummaryStatisticsDb) {
        if (data._id) {
            await this.dataStore.update(data);
        } else {
            await this.dataStore.create(data);
        }
    }

    public async getTweetData(tweetId: any): Promise<TweetDataDb> {
        const records: TweetDataDb[] = await this.dataStore.read(DataType.TweetsData, { 'payload.id': tweetId });

        if (!records || records.length === 0) {
            return undefined;
        }

        return records[records.length - 1];
    }

    //#endregion

    //#region Implementation of IEventHandler<StoreTweetEvent>
    handle(event: StoreDataEvent) {
        switch (event.data.type) {
            case DataType.TweetsData:
                this.dataStore.create<TweetDataDb>(event.data as TweetDataDb);
                break;
            case DataType.SummaryStatistics:
                this.saveSummaryStats(event.data as SummaryStatisticsDb);
                break;
        }
    }
    //#endregion
}
