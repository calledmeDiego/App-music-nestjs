import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { StorageCreatedEvent } from "src/storage/domain/events/storage-created.event";
import { StorageDeletedEvent } from "src/storage/domain/events/storage-deleted.event";

@Injectable()
export class StorageEventHandler {
    @OnEvent('storage.created', {async: true})
    handleStorageCreated(event: StorageCreatedEvent) {
        console.log('Handler de storage creado ejecutado: ', event.ocurredOn)
    }
    @OnEvent('storage.deleted', {async: true})
    handleStorageDeleted(event: StorageDeletedEvent) {
        console.log('Handler de storage eliminado ejecutado: ', event.ocurredOn)
    }

    // @OnEvent('user.logued', {async: true})
    // handleUserLogued(event: UserLoguedEvent) {
    //     console.log('Handler login ejecutado: ', event.ocurredOn)
    // }
}