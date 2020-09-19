import { IDataStoreEntity } from '../cache/models/data.store.entity';

export class StoreDataEvent {
    constructor(public data: IDataStoreEntity) { }
}
