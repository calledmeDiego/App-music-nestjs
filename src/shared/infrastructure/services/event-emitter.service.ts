import { Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { DomainEvent } from "src/shared/domain/events/domain-event.base";
import { EventBus } from "src/shared/domain/events/event-bus";

@Injectable()
export class EventEmitterService implements EventBus {

    constructor(@Inject(EventEmitter2)private readonly eventEmitter: EventEmitter2) {}

    public publish(events: DomainEvent[]): void {
        events.forEach((event: DomainEvent) => {
            this.eventEmitter.emit(event.eventName, event);
        })
    }

}