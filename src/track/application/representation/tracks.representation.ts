
import { StorageRepresentation } from "src/storage/application/representation/storage.representation";
import { StorageEntity } from "src/storage/domain/entities/storage.entity";
import { TrackEntity } from "src/track/domain/entities/track.entity";
import { ArtistRepresentation } from "./artist.representation";
import { DurationRepresentation } from "./duration.representation";
import { TrackRepresentation } from "./track.representation";


export class TracksRepresentation {
    private constructor(private readonly tracks: TrackEntity[], private readonly storageMap: Map<string,StorageEntity>) { }

    public static fromTracks(tracks: any[], storageMap: Map<string, StorageEntity>): TracksRepresentation {
        return new this(tracks, storageMap)
    }

    public format() {
        return this.tracks.map((t) => {
            const mediaId = t.mediaId;
            const storage = mediaId ? this.storageMap.get(mediaId) : null;
            return TrackRepresentation.fromTrack(t, storage).format();
        })
    }
}