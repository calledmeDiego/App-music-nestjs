import { DomainEvent } from "src/shared/domain/events/domain-event.base";
import { UserEntity } from "../entities/user.entity";

export class UserLoguedEvent implements DomainEvent {
    public eventId: string;
    public eventName: string = 'user.logued';
    public readonly ocurredOn: Date
    public constructor(
        public readonly user: Partial<UserEntity>
    ) {
        this.eventId = '';
        this.ocurredOn = new Date();
    }
}