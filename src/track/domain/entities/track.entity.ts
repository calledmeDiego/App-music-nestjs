import { AggregateRoot } from "src/shared/domain/events/aggregate-root";
import { Artist } from "../value-objects/artist.vo";
import { Duration } from "../value-objects/duration.vo";
import { TrackCreatedEvent } from "../events/track-created.event";
import { TrackUpdatedEvent } from "../events/track-updated.event";
import { TrackDeletedEvent } from "../events/track-deleted.event";
import { Uuid } from "src/shared/domain/value-object/Uuid.vo";

export class TrackEntity extends AggregateRoot {
    constructor(
        public readonly id: Uuid,
        public name: string | null,
        public album: string | null,
        public cover: string | null,
        public readonly artist: Artist | null,
        public readonly duration: Duration | null,
        public mediaId: Uuid | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public deletedAt: Date | null
    ) { super() }

    static create(data: {
        name?: string | null,
        album?: string | null,
        cover?: string | null,
        artist?: Artist | null,
        duration?: Duration | null,
        mediaId?: string
    }): TrackEntity {
        const track = new this(Uuid.create(),
            data.name ?? null,
            data.album ?? null,
            data.cover ?? null,
            data.artist ?? null,
            data.duration ?? null,
            data.mediaId ? Uuid.fromString(data.mediaId) : null,
            new Date(),
            new Date(),
            null);

        track.record(new TrackCreatedEvent(track));

        return track;
    }

    static update(data: {
        id: string
        name?: string | null,
        album?: string | null,
        cover?: string | null,
        artist?: Artist | null,
        duration?: Duration | null,
        mediaId?: string
        createdAt: Date
    }) {
        const track = new this(
            Uuid.fromString(data.id),
            data.name ?? null,
            data.album ?? null,
            data.cover ?? null,
            data.artist ?? null,
            data.duration ?? null,
            data.mediaId ? Uuid.fromString(data.mediaId) : null,
            data.createdAt,
            new Date(),
            null);
        track.record(new TrackUpdatedEvent(track));
        return track;
    }

    rename(newName: string) {
        if (newName.length < 2) throw new Error('Nombre muy corto');
        this.name = newName;
    }

    delete() {
        this.record(new TrackDeletedEvent(this))
    }

    static fromPrimitives({ id, name, album, cover, artist, duration, mediaId, createdAt, updatedAt }: {
        id: string,
        name: string,
        album: string,
        cover: string,
        artist: any,
        duration: any,
        mediaId: string,
        createdAt: Date, updatedAt: Date
    }
    ) {
        return new this(
            Uuid.fromString(id),
            name,
            album,
            cover,
            artist,
            duration,
            Uuid.fromString(mediaId),
            createdAt,
            updatedAt,
            null
        )
    }

    toPrimitives() {
        const { mediaId, deletedAt, ...publicData } = this;

        return publicData;
    }


    static FromDbToEntityParse(data) {
        const entity = TrackEntity.fromPrimitives(data);

        return entity;
    }
}