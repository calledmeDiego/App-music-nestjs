import { StorageEntity } from "../entities/storage.entity";

export interface StorageRepository {
    create(storage: StorageEntity): Promise<StorageEntity>;
    findById(id: string): Promise<StorageEntity | null>;
    listAll(): Promise<StorageEntity[]>;
    findManyById(ids: string[]): Promise<StorageEntity[]>;
    update(id: string, storage: StorageEntity): Promise<any>;
    delete(id: string);
}