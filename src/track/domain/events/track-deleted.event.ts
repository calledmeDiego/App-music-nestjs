import { DomainEvent } from "src/shared/domain/events/domain-event.base";
import { TrackEntity } from "../entities/track.entity";


export class TrackDeletedEvent implements DomainEvent {
    public eventId: string;
    public eventName: string = 'track.deleted';
    public ocurredOn: Date
    public constructor(
        public readonly storage: Partial<TrackEntity>
    ) {
        this.eventId = '';
        this.ocurredOn = new Date();
    }
}