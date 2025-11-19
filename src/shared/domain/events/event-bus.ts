import { DomainEvent } from "./domain-event.base";

// export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void> | void;

// export class EventBus {
//     private handlers: Map<string, EventHandler[]> = new Map();

//     // Registrar un manejador (suscriptor)
//     subscribe<T extends DomainEvent>(eventName: string, handler: EventHandler<T>) {
//         if (!this.handlers.has(eventName)) {
//             this.handlers.set(eventName, []);
//         }
//         this.handlers.get(eventName)!.push(handler as EventHandler);
//     }

//     async publish(event: DomainEvent) {
//         const eventName = event.eventName;
//         const eventHandlers = this.handlers.get(eventName) || [];
//         for (const handler of eventHandlers) {
//             await handler(event);
//         }
//     }
// }

export interface EventBus {
  publish(events: DomainEvent[]): void
}

export const eventBusDefinition = {
  name: 'EventBus',
}


