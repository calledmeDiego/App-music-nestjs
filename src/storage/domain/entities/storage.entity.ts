import { AggregateRoot } from "src/shared/domain/events/aggregate-root";
import { StorageCreatedEvent } from "../events/storage-created.event";

export class StorageEntity extends AggregateRoot {
    private constructor(
        public readonly id: string,
        public readonly url: string,
        public readonly filename: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { super() }


    static fromPrimitives({ id, url, filename,createdAt, updatedAt }: {
        id: string,
        url: string,
        filename: string, createdAt: Date, updatedAt: Date
    }
    ) {
        return new this(
            id,
            url,
            filename,
            createdAt, updatedAt
        )
    }

    static create(data: {
        url: string,
        filename: string
    }) {
        const currentDate = new Date();
        const storage = new this(
            '',
            data.url,
            data.filename,
            currentDate,
            currentDate
        );
        storage.record(new StorageCreatedEvent(storage))
        return storage;
    }

    toPrimitives() {
        const { updatedAt, ...publicData } = this;
        // return {
        //     id: this.id,
        //     url: this.url,
        //     filename: this.filename,
        //     createdAt: this.createdAt
        // }
        return publicData;
    }

    static FromDbToEntityParse(data) {
        return StorageEntity.fromPrimitives(data);
    }


}