import { DomainEvent } from "./domain-event.base";

export interface EventBus {
  publish(events: DomainEvent[]): void
}

export const eventBusDefinition = {
  name: 'EventBus',
}


