import { AggregateRoot } from "src/shared/domain/events/aggregate-root";
import { Artist } from "../value-objects/artist.vo";
import { Duration } from "../value-objects/duration.vo";
import { TrackCreatedEvent } from "../events/track-created.event";

export class TrackEntity extends AggregateRoot {
    constructor(
        public readonly id: string,
        public readonly name: string | null,
        public readonly album: string | null,
        public readonly cover: string | null,
        public readonly artist: Artist | null,
        public readonly duration: Duration | null,
        public readonly mediaId: string | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly deletedAt: Date | null
    ) { super() }

    static create(data: {
        name?: string | null,
        album?: string | null,
        cover?: string | null,
        artist?: Artist | null,
        duration?: Duration | null,
        mediaId?: string | null
    }): TrackEntity {
        const track = new this('',
            data.name ?? null,
            data.album ?? null,
            data.cover ?? null,
            data.artist ?? null,
            data.duration ?? null,
            data.mediaId ?? null,
            new Date(),
            new Date(),
            null);

        track.record(new TrackCreatedEvent(track));

        return track;
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
            id,
            name,
            album,
            cover,
            artist,
            duration,
            mediaId,
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