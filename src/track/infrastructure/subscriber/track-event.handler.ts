import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { TrackCreatedEvent } from "src/track/domain/events/track-created.event";
import { TrackUpdatedEvent } from "src/track/domain/events/track-updated.event";

@Injectable()
export class TrackEventHandler {
    @OnEvent('track.created', {async: true})
    handleTrackCreated(event: TrackCreatedEvent) {
        console.log('Handler de track creado ejecutado: ', event.ocurredOn)
    }

    @OnEvent('track.updated', {async: true})
    handleTrackUpdated(event: TrackUpdatedEvent) {
        console.log('Handler de track editado ejecutado: ', event.ocurredOn)
    }

    @OnEvent('track.deleted', {async: true})
    handleTrackDeleted(event: TrackUpdatedEvent) {
        console.log('Handler de track eliminado ejecutado: ', event.ocurredOn)
    }
}