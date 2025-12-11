import { Uuid } from "src/shared/domain/value-object/Uuid.vo";
import { StorageEntity } from "../entities/storage.entity";

export interface StorageRepository {
    create(storage: StorageEntity): Promise<StorageEntity>;
    findById(id: Uuid): Promise<StorageEntity | null>;
    listAll(): Promise<StorageEntity[]>;
    findManyById(ids: Uuid[]): Promise<StorageEntity[]>;
    update(id: Uuid, storage: StorageEntity): Promise<StorageEntity>;
    delete(id: Uuid): Promise<StorageEntity>;
}

export const storageRepositoryName = 'StorageRepository';