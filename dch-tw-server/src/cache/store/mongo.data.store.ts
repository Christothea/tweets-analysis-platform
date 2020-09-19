import { Db, MongoClient } from 'mongodb';
import { DataStoreOptions } from './data.store.options';
import { IDataStoreEntity } from '../models/data.store.entity';

/*
* Provide the API of communication with mongo data store
* - Create records (insert documents)
* - Read records (find documents)
*
*/
export class MongoDataStore<ET>{

    private mongoClient: MongoClient;
    private mongodb: Db;

    constructor(public readonly options: DataStoreOptions) {

    }

    private get connectionUrl(): string {
        return `mongodb://${this.options.host}:${this.options.port}/${this.options.database}`;
    }

    public async connect() {
        try {
            this.mongoClient = new MongoClient(this.connectionUrl);
            await this.mongoClient.connect();
            this.mongodb = this.mongoClient.db(this.options.database);
        } catch (ex) {
            console.error('Failed Data Store Connect');
            console.error(ex);
            throw ex;
        }
    }

    public close() {
        if (!this.mongoClient) {
            return;
        }

        try {
            this.mongoClient.close();
        } catch (ex) {
            console.warn('Failed Data Store Close');
            console.warn(ex);
        }
    }

    public async create<DT extends IDataStoreEntity>(data: DT) {
        if (!data) {
            console.warn('Undefined Data and/or Invalid Entity Type');
            return undefined;
        }

        while (!this.mongodb) {
            await new Promise(r => setTimeout(r, 300));
        }

        try {
            const insertResult = await this.mongodb.collection(data.type).insertOne(data);

            if (insertResult.insertedCount === 0) {
                console.warn(`Failed Data Store Create: ${data.type}`);

                return undefined;
            }

            return data;
        } catch (ex) {
            console.error(`Failed Data Store Create: ${data.type}`);
        }

        return undefined;
    }

    public async read(entityType: ET, queryArgs?: {}) {
        while (!this.mongodb) {
            await new Promise(r => setTimeout(r, 300));
        }

        try {
            if (!queryArgs) {
                return await this.mongodb.collection(entityType).find().sort({ _id: -1 }).toArray();
            } else {
                return await this.mongodb.collection(entityType).find(queryArgs).sort({ _id: -1 }).toArray();
            }
        } catch (ex) {
            console.error('Data Store Read Exception');
            console.error(ex);
        }

        return null;
    }

    public async update<DT extends IDataStoreEntity>(data: DT) {
        if (!data) {
            console.warn('Undefined Data and/or Invalid Entity Type');
            return undefined;
        }

        while (!this.mongodb) {
            await new Promise(r => setTimeout(r, 300));
        }

        try {
            const updateResult = await this.mongodb.collection(data.type).updateOne({ _id: data._id }
                , { $set: data });

            if (updateResult.insertedCount === 0) {
                console.warn(`Failed Data Store Update: ${data.type}`);

                return undefined;
            }

            return data;
        } catch (ex) {
            console.error(`Data Store Update Exception: ${data.type}`);
            console.error(ex);
        }

        return undefined;
    }
}
