import { DataType } from './data.type';

export interface IDataStoreEntity {
    _id?: any;
    createdAt: Date;
    type: DataType;
}
