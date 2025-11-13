import { DomainEvent } from "src/shared/domain/events/domain-event.base";

export class UserRegisteredEvent extends DomainEvent {
    constructor(
        public readonly userId: string,
        public readonly email: string
    ) {
        super('UserRegisteredEvent');
    }
}