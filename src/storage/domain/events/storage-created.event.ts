import { DomainEvent } from "src/shared/domain/events/domain-event.base";
import { StorageEntity } from "../entities/storage.entity";

export class StorageCreatedEvent implements DomainEvent {
    public eventId: string;
    public eventName: string = 'storage.created';
    public ocurredOn: Date
    public constructor(
        public readonly storage: Partial<StorageEntity>
    ) {
        this.eventId = '';
        this.ocurredOn = new Date();
    }
}