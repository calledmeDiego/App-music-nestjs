import { DomainEvent } from "./domain-event.base";

export abstract class AggregateRoot {
    private domainEvents: Array<DomainEvent>

    /**
     *
     */
    constructor() {
        this.domainEvents = [];
    }

    pullEvents(): Array<DomainEvent> {
        const domainEvents = this.domainEvents.slice();
        this.domainEvents = [];
        return domainEvents;
    }

    record(event:DomainEvent) {
        this.domainEvents.push(event);
    }

    abstract toPrimitives(): any;
}