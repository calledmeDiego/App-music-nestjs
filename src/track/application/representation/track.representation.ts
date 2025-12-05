
import { StorageRepresentation } from "src/storage/application/representation/storage.representation";
import { StorageEntity } from "src/storage/domain/entities/storage.entity";
import { TrackEntity } from "src/track/domain/entities/track.entity";
import { ArtistRepresentation } from "./artist.representation";
import { DurationRepresentation } from "./duration.representation";


export class TrackRepresentation {
    private constructor(private readonly track: TrackEntity, private readonly storage?: StorageEntity | null) { }

    public static fromTrack(track: TrackEntity, storage?: StorageEntity | null): TrackRepresentation {
        return new this(track,storage)
    }

    public format() {
        const track = this.track.toPrimitives()

        return {
            id: track.id.value,
            name: track.name,
            album: track.album,
            cover: track.cover,
            artist: ArtistRepresentation.fromArtist(track.artist!).format(),
            duration: DurationRepresentation.fromDuration(track.duration!).format(),
            media: this.storage ? StorageRepresentation.fromStorage(this.storage).format() : null,
            createdAt: track.createdAt.toISOString(),
        }
    }
}