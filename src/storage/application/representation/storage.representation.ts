
import { StorageEntity } from "src/storage/domain/entities/storage.entity";


export class StorageRepresentation {
    private constructor(private readonly storage: StorageEntity) { }

    public static fromStorage(storage): StorageRepresentation {
        return new this(storage)
    }

    public format() {
        const storage = this.storage.toPrimitives()

        return {
            id: storage.id,
            url: storage.url,
            filename: storage.filename,
            createdAt: storage.createdAt.toISOString(),
        }
    }
}