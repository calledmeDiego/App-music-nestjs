
import { StorageEntity } from "src/storage/domain/entities/storage.entity";
import { StorageRepresentation } from "./storage.representation";


export class StoragesRepresentation {
    private constructor(private readonly storages: StorageEntity[]) { }

    public static fromStorages(storages: any[]): StoragesRepresentation {
        return new this(storages)
    }

    public format() {
        return this.storages.map((s) => {
            return StorageRepresentation.fromStorage(s).format();
        })
    }
}