import { Artist } from "../value-object/artist.vo";
import { Duration } from "../value-object/duration.vo";

export class TrackEntity {
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
    ) { }

    static CreateForm(data: {
        name?: string | null,
        album?: string | null,
        cover?: string | null,
        artist?: Artist | null,
        duration?: Duration | null,
        mediaId?: string | null
    }): TrackEntity {
        return new TrackEntity('',
            data.name ?? null,
            data.album ?? null,
            data.cover ?? null,
            data.artist ?? null,
            data.duration ?? null,
            data.mediaId ?? null,
            new Date(),
            new Date(),
            null)
    }

    static ShowJSON(data) {
        return new TrackEntity(
            data.id,
            data.name,
            data.album,
            data.cover,
            data.artist,
            data.duration,
            data.mediaId,
            data.createdAt,
            data.updatedAt,
            null
        );
    }    
}